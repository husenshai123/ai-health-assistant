const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number },
    gender: { type: String },
    medicalHistory: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Profile', profileSchema);