const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // Hamara security guard
const { getHealthAnalysis, getChatHistory } = require('../controllers/aiController');

// GET request: User ki purani chat history fetch karne ke liye
router.get('/history', verifyToken, getChatHistory);

// POST request: Naya message bhejne ke liye (ispar bhi verifyToken lagaya hai taaki DB me user ID save ho)
router.post('/chat', verifyToken, getHealthAnalysis);

module.exports = router;