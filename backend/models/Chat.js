const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    messages: [
        {
            role: { type: String, required: true }, // 'user' ya 'ai'
            text: { type: String },
            imageUrl: { type: String },
            time: { type: String },
            isReport: { type: Boolean, default: false },
            reportData: { type: Object }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);