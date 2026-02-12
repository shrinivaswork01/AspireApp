
import { GoogleGenAI, Type } from "@google/genai";

// Always use a named parameter for initialization and obtain API_KEY from process.env.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProposal = async (clientName: string, eventType: string, packageName: string, price: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a professional and friendly photography proposal for ${clientName} for their ${eventType}. Mention the package "${packageName}" which costs $${price}. Keep it concise and elegant.`
  });
  // Access the .text property directly.
  return response.text;
};

export const generateWhatsAppReply = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a polite and professional WhatsApp business reply to this inquiry: "${query}". Keep it short and helpful.`
  });
  // Access the .text property directly.
  return response.text;
};

export const generateInstagramCaption = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create an engaging Instagram caption for a photography post with this context: "${description}". Include relevant hashtags.`
  });
  // Access the .text property directly.
  return response.text;
};

export const generateBusinessInsights = async (dataSummary: string) => {
  const ai = getAI();
  // Use gemini-3-pro-preview for more complex reasoning and analysis tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following business data summary and provide 3 key business insights. Data: ${dataSummary}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'The title of the insight.',
            },
            content: {
              type: Type.STRING,
              description: 'The detailed content of the insight.',
            },
            type: {
              type: Type.STRING,
              description: 'The category of insight: positive, neutral, or action.',
            }
          },
          required: ['title', 'content', 'type'],
          propertyOrdering: ["title", "content", "type"]
        }
      }
    }
  });
  // Access the .text property directly and parse the JSON response.
  return JSON.parse(response.text || '[]');
};
