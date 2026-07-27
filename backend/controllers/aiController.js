const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getHealthAnalysis = async (req, res) => {
    const { message } = req.body; 

    // Yahan humne prompt ko smart banaya hai
    const systemInstruction = `
        You are an advanced AI Medical Assistant. Analyze the user's input.
        
        RULE 1 (Classification): 
        - 90% of the time, treat the input as a "Medical Query" (isMedical: true). This includes symptoms (cough, fever), body states (sleeping, tired), or health questions.
        - ONLY treat pure greetings or casual talk ("hey", "hi", "how are you", "thanks") as "General Chat" (isMedical: false).

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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // "User Symptoms:" hata diya taaki wo normal chat ko symptom na samjhe
            contents: message, 
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json" 
            }
        });

        const jsonResult = JSON.parse(response.text);
        res.status(200).json(jsonResult);
        
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = { getHealthAnalysis };