import { GoogleGenAI } from "@google/genai";

// Use gemini-2.5-flash-latest or similar as strictly instructed in system prompt
// if user provided models in dropdown, we still route to valid Gemini SDK models.
const MODEL_MAPPING: Record<string, string> = {
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite-latest",
  "gpt-4o-mini": "gemini-2.5-flash", // Fallback for demo
  "gpt-4.1-mini": "gemini-2.5-flash", // Fallback
  "claude-3-5-sonnet-2024-10": "gemini-2.5-flash", // Fallback
};

export const generateContent = async (
  apiKey: string,
  modelName: string,
  systemInstruction: string,
  userPrompt: string,
  temperature: number = 0.2
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  // Resolve model name to a valid Gemini model if it's a "simulated" other model
  const effectiveModel = MODEL_MAPPING[modelName] || "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: effectiveModel,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
      }
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Unknown error occurred"}`;
  }
};
