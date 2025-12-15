import { GoogleGenAI } from "@google/genai";
import { AgentRole } from "../types";

// Safe wrapper to ensure we don't crash if env is missing during pure frontend demo
const API_KEY = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

export const generateAgentResponse = async (
  prompt: string, 
  role: AgentRole, 
  context: string = ''
): Promise<string> => {
  if (!ai) {
    // Fallback for demo without key
    return `[System] API Key not configured. Simulating ${role} response to: "${prompt}"`;
  }

  let modelName = 'gemini-2.5-flash';
  let systemInstruction = '';

  switch (role) {
    case AgentRole.ARCHITECT:
      modelName = 'gemini-3-pro-preview'; // Smarter model for architecture
      systemInstruction = 'You are a Senior Software Architect. Analyze the requirements and propose a scalable, robust tech stack and file structure. Output pure JSON or Markdown.';
      break;
    case AgentRole.INTEGRATOR:
      modelName = 'gemini-2.5-flash';
      systemInstruction = 'You are an Integration Specialist using Context 7 MCP. Your job is to verify library versions and integration patterns. Check docs.';
      break;
    case AgentRole.CODER:
      modelName = 'gemini-2.5-flash';
      systemInstruction = 'You are a Senior React Developer. Write clean, performant, modern code. TypeScript only. Tailwind CSS only.';
      break;
    default:
      modelName = 'gemini-2.5-flash';
      systemInstruction = 'You are a helpful Project Manager agent.';
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Context: ${context}\n\nTask: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error", error);
    return `Error generating content: ${(error as Error).message}`;
  }
};