
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Correctly initialize GoogleGenAI with the named parameter 'apiKey' using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMeal = async (mealDescription: string, base64Image?: string) => {
  const model = 'gemini-3-flash-preview';
  
  let parts: any[] = [{ text: `Act as an expert nutritionist. Analyze this meal: "${mealDescription}". 
    Provide nutrition data in JSON format including: name, estimated calories, protein(g), carbs(g), fat(g), and a short fun, encouraging feedback (max 20 words).
    Keep the feedback professional yet motivating for someone on a weight loss journey.` }];
  
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          feedback: { type: Type.STRING }
        },
        required: ["name", "calories", "protein", "carbs", "fat", "feedback"]
      }
    }
  });

  // Use .text property directly as it is a getter.
  return JSON.parse(response.text || '{}');
};

export const getCoachAdvice = async (history: any[]) => {
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: `Based on the user's recent logs: ${JSON.stringify(history)}, give 3 personalized tips for tomorrow. Make it engaging and concise.`
  });
  // Use .text property directly as it is a getter.
  return response.text || '';
};
