require('dotenv').config();

const express = require('express');
const cors = require('cors'); //in case frontend and backend are different routes
const aiRoutes = require('./routes/aiRoutes'); // imported new route

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); //to read the json data

app.use('/api/ai', aiRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});