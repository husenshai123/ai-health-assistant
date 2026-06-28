const express = require('express');
const router = express.Router();

const { getHealthAnalysis } = require('../controllers/aiController');

// when post request came from fronend this function work
router.post('/chat', getHealthAnalysis);

module.exports = router;