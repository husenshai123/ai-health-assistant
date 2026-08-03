const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getHealthAnalysis = async (req, res) => {
    // NAYA: image bhi destructure kar rahe hain
    const { message, image } = req.body; 

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
        
        // NAYA: Agar image aayi hai, toh usko inlineData format me array me daal do
        if (image) {
            contents.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Flash model natively supports images
            contents: contents, 
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