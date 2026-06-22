const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Middleware
app.use(cors()); // Frontend ko backend se baat karne ki permission deta hai
app.use(express.json()); // JSON data read karne ke liye

// Gemini API Initialize kar rahe hain .env wali key se
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API Route jahan frontend se message aayega
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.prompt;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Gemini AI ko request bhej rahe hain
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                // Yeh instruction AI ko uska role define karta hai
                systemInstruction: "You are a professional AI Health Assistant. Provide helpful, concise, and general health advice based on the symptoms described. Always add a small disclaimer at the end stating that you are an AI and the user should consult a real doctor for serious medical concerns. Do not answer questions unrelated to health or medicine."
            }
        });

        // AI ka reply frontend ko wapas bhej rahe hain
        res.json({ text: response.text });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from AI" });
    }
});

// Server start karne ka code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});