// backend/models/Report.js

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // Abhi ke liye hum user id nahi daal rahe jab tak login nahi ban jata
    symptoms: { 
        type: String, 
        required: true 
    },
    urgencyLevel: { 
        type: String, 
        required: true 
    },
    possibleConditions: { 
        type: [String], // Array of strings
        default: [] 
    },
    suggestedSpecialist: { 
        type: String 
    },
    homeRemedies: { 
        type: [String], 
        default: [] 
    },
    precautionarySteps: { 
        type: [String], 
        default: [] 
    },
    disclaimer: { 
        type: String 
    }
}, { timestamps: true }); // timestamps automatically created_at aur updated_at save karega

module.exports = mongoose.model('Report', reportSchema);