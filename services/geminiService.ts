import { GoogleGenAI, Type } from "@google/genai";

const getEnv = (key: string, fallback: string = "") => {
  if (typeof window !== 'undefined' && (window as any).process?.env) {
    return (window as any).process.env[key] || fallback;
  }
  return fallback;
};

const getAI = () => new GoogleGenAI({ apiKey: getEnv('API_KEY') });

export const generateProposal = async (clientName: string, eventType: string, packageName: string, price: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a professional and friendly photography proposal for ${clientName} for their ${eventType}. Mention the package "${packageName}" which costs $${price}. Keep it concise and elegant.`
  });
  return response.text;
};

export const generateWhatsAppReply = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a polite and professional WhatsApp business reply to this inquiry: "${query}". Keep it short and helpful.`
  });
  return response.text;
};

export const generateInstagramCaption = async (description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create an engaging Instagram caption for a photography post with this context: "${description}". Include relevant hashtags.`
  });
  return response.text;
};

export const generateBusinessInsights = async (dataSummary: string) => {
  const ai = getAI();
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
  return JSON.parse(response.text || '[]');
};