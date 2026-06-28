const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getHealthAnalysis = async (req, res) => {
    const { message } = req.body; 

    const systemInstruction = `
        You are an advanced AI Medical Assistant. Analyze the user's symptoms and return the output STRICTLY in the following JSON format. Do not include any markdown or markdown code blocks like \`\`\`json.
        
        JSON Structure:
        {
            "urgencyLevel": "Low" | "Medium" | "High",
            "possibleConditions": ["Condition 1", "Condition 2"],
            "suggestedSpecialist": "e.g., Cardiologist, Dermatologist",
            "homeRemedies": ["Remedy 1", "Remedy 2"],
            "precautionarySteps": ["Step 1", "Step 2"],
            "disclaimer": "Write a standard medical disclaimer here."
        }
            Analyze the user's input language. You must provide the values in the JSON object in the exact same language (e.g., Hindi, Hinglish, or English) used by the user. HOWEVER, the JSON keys must strictly remain in English
    `;

    try {
        // to call and integrate ai model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User Symptoms: ${message}`,
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