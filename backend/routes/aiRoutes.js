const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // Hamara security guard
const { getHealthAnalysis, getChatHistory } = require('../controllers/aiController');
const { saveProfile, getProfile } = require('../controllers/profileController');

// GET request: User ki purani chat history fetch karne ke liye
router.get('/history', verifyToken, getChatHistory);

// POST request: Naya message bhejne ke liye (ispar bhi verifyToken lagaya hai taaki DB me user ID save ho)
router.post('/chat', verifyToken, getHealthAnalysis);

// Naye Profile Routes (verifyToken ke sath)
router.post('/profile', verifyToken, saveProfile);
router.get('/profile', verifyToken, getProfile);
module.exports = router;