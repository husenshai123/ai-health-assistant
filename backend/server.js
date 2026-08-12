require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. Imports
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes'); // Tumhara purana AI route yahan hoga

// 2. APP INITIALIZATION (Ye line sabse zaroori hai pehle aani chahiye)
const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// 4. MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-health-app"; 
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully! 🚀'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// 5. Routes Use Karna (app banne ke baad)
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); // Tumhara purana route

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});