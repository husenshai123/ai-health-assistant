const { GoogleGenAI } = require("@google/genai");
const Chat = require('../models/Chat'); // NAYA: Chat model import kiya

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// NAYA: Time format karne ka function DB save ke liye
const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getHealthAnalysis = async (req, res) => {
    const { message, image } = req.body; 
    const userId = req.user.id; // NAYA: Middleware se aayi hui User ID

    const systemInstruction = `
        You are an advanced AI Medical Assistant. Analyze the user's input and any provided images (like medical reports, prescriptions, or visible symptoms).
        
        RULE 1 (Classification): 
        - 90% of the time, treat the input as a "Medical Query" (isMedical: true). This includes symptoms (cough, fever), body states (sleeping, tired), health questions, or analyzing medical images/reports.
        - ONLY treat pure greetings or casual talk ("hey", "hi", "how are you", "thanks") without any images as "General Chat" (isMedical: false).

        RULE 2 (Formatting):
        - Output EXACTLY in the JSON format below. Do not use markdown blocks (\`\`\`json).
        
        JSON Structure:
        {
            "isMedical": boolean,
            "generalResponse": "If isMedical is false, write a natural 1-line conversational reply here answering the user. If isMedical is true, leave this as an empty string.",
            "reportData": {
                "urgencyLevel": "Low | Medium | High | N/A",
                "possibleConditions": ["Condition 1", "Condition 2"],
                "suggestedSpecialist": "e.g., General Physician, Dermatologist",
                "homeRemedies": ["Remedy 1", "Remedy 2"],
                "precautionarySteps": ["Step 1", "Step 2"],
                "disclaimer": "Standard medical disclaimer"
            }
        }
        
        Analyze the user's input language and respond in the same language, but keep JSON keys strictly in English.
    `;

    try {
        let contents = [];
        
        if (message) contents.push(message);
        
        if (image) {
            contents.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: contents, 
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json" 
            }
        });

        const jsonResult = JSON.parse(response.text);

        // NAYA LOGIC: Database me save karna
        const currentTime = formatTime();
        
        // 1. Check karo ki is user ki pehle se chat hai ya nahi
        let chatDocument = await Chat.findOne({ userId });
        if (!chatDocument) {
            chatDocument = new Chat({ userId, messages: [] });
        }

        // 2. User ka message DB me push karo
        chatDocument.messages.push({
            role: 'user',
            text: image ? `[Image Attached] ${message || "Analyze this image."}` : message,
            time: currentTime
        });

        // 3. AI ka response DB me push karo
        chatDocument.messages.push({
            role: 'ai',
            text: jsonResult.isMedical ? "" : jsonResult.generalResponse,
            isReport: jsonResult.isMedical,
            reportData: jsonResult.isMedical ? jsonResult.reportData : null,
            time: currentTime
        });

        // 4. Finally database me save kar do
        await chatDocument.save();

        res.status(200).json(jsonResult);
        
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// NAYA FUNCTION: User ki purani history mangwane ke liye
const getChatHistory = async (req, res) => {
    try {
        const chat = await Chat.findOne({ userId: req.user.id });
        if (!chat) {
            return res.status(200).json([]); // Agar koi purani chat nahi hai, toh empty array bhej do
        }
        res.status(200).json(chat.messages);
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};

module.exports = { getHealthAnalysis, getChatHistory };