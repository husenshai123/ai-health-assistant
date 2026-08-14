const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Frontend se token aayega header me
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        // Token ko verify kar rahe hain
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'supersecretkey');
        req.user = verified; // User ki ID req.user me save ho jayegi
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = verifyToken;