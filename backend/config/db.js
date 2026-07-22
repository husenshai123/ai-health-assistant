// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Local MongoDB URL. Agar Atlas (cloud) use kar raha hai toh uska URL .env me daal dena.
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/health_assistant"; 
        
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully 📦");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌", error);
        process.exit(1); // Error aane par server band kar do
    }
};

module.exports = connectDB;