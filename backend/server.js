// backend/server.js

require('dotenv').config(); // Environment variables load karne ke liye (Sabse upar)
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. Database connection file ko import kiya
const aiRoutes = require('./routes/aiRoutes');

const app = express();
 
// 2. Database ko connect karne ka function call kiya
connectDB(); 

// Middlewares
app.use(cors());
app.use(express.json()); // Frontend se JSON data read karne ke liye

// Routes setup
app.use('/api/ai', aiRoutes); 

// Import health tips controller
const { getHealthTips } = require('./controllers/healthController');
// Register health tips route
app.get('/api/health-tips', getHealthTips);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});