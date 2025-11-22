import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage, Role, UploadedFile, AppSettings } from "../types";

// Initialize the API client
// Note: In a production app, never expose keys on the client. This is for demo purposes.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getGenerationConfig = (mode: string) => {
  switch (mode) {
    case 'precise':
      return { temperature: 0.2, topP: 0.8, topK: 40 };
    case 'creative':
      return { temperature: 0.9, topP: 0.95, topK: 64 };
    case 'balanced':
    default:
      return { temperature: 0.7, topP: 0.95, topK: 40 };
  }
};

export const generateResponse = async (
  history: ChatMessage[],
  currentPrompt: string,
  files: UploadedFile[],
  settings: AppSettings
): Promise<string> => {
  try {
    // Determine model name: use fine-tuned ID if present, otherwise generic model
    const activeModel = settings.fineTunedModelId || 'gemini-2.5-flash';

    // Construct the history for the API
    // We need to convert our internal ChatMessage[] to the API's Content[] format
    
    // 1. Prepare Document Parts
    const fileParts: Part[] = files.map(file => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data
      }
    }));

    // 2. Prepare Text Part
    const textPart: Part = {
      text: currentPrompt
    };

    // 3. Construct Current Message Content
    const currentMessageParts: Part[] = [...fileParts, textPart];

    // 4. Construct History (excluding the current turn which we just built)
    const previousHistory: Content[] = history
      .filter(msg => !msg.isError)
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

    // 5. Create Chat Session
    const chat = ai.chats.create({
      model: activeModel,
      history: previousHistory,
      config: {
        systemInstruction: settings.systemPrompt,
        ...getGenerationConfig(settings.llmMode)
      }
    });

    // 6. Send Message
    const response = await chat.sendMessage({
      message: currentMessageParts
    });

    return response.text || "I couldn't generate a response.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An unexpected error occurred while communicating with Gemini.");
  }
};