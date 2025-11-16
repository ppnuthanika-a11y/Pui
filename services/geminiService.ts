
import { GoogleGenAI, Type } from "@google/genai";
import type { System } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Suggests system permissions for a user based on their job title using the Gemini API.
 * @param title The user's job title.
 * @param availableSystems A list of all possible systems.
 * @returns A promise that resolves to an array of suggested system IDs.
 */
export const suggestPermissionsForUser = async (title: string, availableSystems: System[]): Promise<string[]> => {
  const model = 'gemini-2.5-flash';

  const systemList = availableSystems.map(s => `"${s.id}" (${s.name})`).join(', ');

  const prompt = `Based on the job title "${title}", suggest the most appropriate system permissions from the following list.
  Only return system IDs that are present in this list: [${systemList}].
  For example, a 'Senior Software Engineer' should have 'devops' and 'eservice'. A 'System Administrator' must have 'ad'. A 'Marketing' role might need 'bi' and 'groupmail'.
  Return your answer as a JSON object with a single key "suggested_permissions" which is an array of system ID strings.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggested_permissions: {
              type: Type.ARRAY,
              description: "A list of suggested system IDs based on the user's title.",
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      console.warn("Gemini API returned an empty response.");
      return [];
    }
    
    const result = JSON.parse(jsonString);
    const availableSystemIds = availableSystems.map(s => s.id);

    if (result && Array.isArray(result.suggested_permissions)) {
        // Filter suggestions to ensure they are valid system IDs
        return result.suggested_permissions.filter((systemId: string) => availableSystemIds.includes(systemId));
    }
    
    console.warn("Could not parse suggested permissions from Gemini response", result);
    return [];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestions from Gemini API.");
  }
};