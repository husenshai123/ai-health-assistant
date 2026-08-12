const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// 1. REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Password encrypt kar rahe hain
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Registration failed or email exists." });
    }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // JWT Token generate kar rahe hain
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });
        res.status(200).json({ message: "Login successful", token, name: user.name });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;