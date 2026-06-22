const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Middleware
app.use(cors()); // permission to talk with fronend
app.use(express.json()); // to read the JSON data

// Gemini API Initialize
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API Route where come the reply
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.prompt;

        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // send request to Gemini AI 
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                // instruction to define the role to AI
                systemInstruction: "You are a professional AI Health Assistant. Provide helpful, concise, and general health advice based on the symptoms described. Always add a small disclaimer at the end stating that you are an AI and the user should consult a real doctor for serious medical concerns. Do not answer questions unrelated to health or medicine."
            }
        });

        // send back reply to frontend
        res.json({ text: response.text });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from AI" });
    }
});

// code for start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});