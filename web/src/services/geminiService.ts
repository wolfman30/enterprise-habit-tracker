import { GoogleGenAI } from "@google/genai";
import { Habit, HabitEntry } from "../types";

// NOTE: The API key is obtained from process.env.API_KEY as per instructions.
// This requires the Vite config to define 'process.env'.
const API_KEY = process.env.API_KEY || '';

const isAIEnabled = !!API_KEY;

export const getHabitInsights = async (habits: Habit[], entries: HabitEntry[]): Promise<string> => {
  if (!isAIEnabled) {
    return "Please configure the Gemini API Key to receive AI insights about your habits.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare data for the prompt
    const summary = habits.map(h => {
        const hEntries = entries.filter(e => e.habit_id === h.id);
        const total = hEntries.reduce((sum, e) => sum + e.value, 0);
        return `- ${h.name}: Target ${h.target_value} ${h.unit}/${h.frequency}. Logged total: ${total} ${h.unit}.`;
    }).join('\n');

    const prompt = `
      Act as a supportive but firm habit coach. 
      Analyze the following habit data for this week and give 
      3 bullet points of constructive feedback and 1 motivational quote.
      
      Data:
      ${summary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Keep pushing! You're doing great.";

  } catch (error) {
    console.error("AI Service Error:", error);
    return "I'm having trouble analyzing your habits right now. Try again later!";
  }
};