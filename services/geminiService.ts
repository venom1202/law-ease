import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk, SimplifiedResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts a JSON object from a string that might contain markdown fences or other text.
 * @param text The raw string response from the AI model.
 * @returns The parsed JSON object.
 * @throws {Error} If no valid JSON object can be found or parsed.
 */
function extractAndParseJson(text: string): any {
    // Attempt to find JSON within markdown code blocks
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(codeBlockRegex);

    let jsonString = text.trim();

    if (match && match[1]) {
        // If a JSON code block is found, use its content
        jsonString = match[1].trim();
    } else {
        // Otherwise, try to find the first '{' and last '}'
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
        }
    }
    
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse JSON string:", jsonString);
        throw new Error("The AI returned a response in an unexpected format.");
    }
}

export async function simplifyTextWithSearch(query: string, language: string): Promise<{ data: Omit<SimplifiedResult, 'query' | 'sources' | 'visualAidUrl'>; sources: GroundingChunk[] }> {
  try {
    const prompt = `You are an expert in Indian law and finance. Your task is to analyze the user's query and provide a response as a single valid JSON object.
Your entire output must be ONLY the JSON object. Do not wrap it in markdown like \`\`\`json. Do not add any introductory or concluding text.

Query: "${query}" in ${language}.

1.  **Analyze the Query Type**: Determine if the query is a request for a procedural guide (e.g., "how to...", "what are the steps for...", "process of...") or a request for a general explanation.
2.  **Use Google Search**: Ground your entire response using the provided search tool.
3.  **Add Citations**: For every statement, including in summaries, document descriptions, and step descriptions, you MUST add citation markers in the format [1], [2], etc. The first source corresponds to [1], the second to [2], and so on.
4.  **Populate the JSON**: Your response must be a JSON object with the following properties: "title", "summary", "isGuide", "documents", and "steps".
    *   If it's a procedural guide, set \`isGuide\` to \`true\`. Provide a \`title\`, a brief \`summary\` of the process, and fill the \`documents\` and \`steps\` arrays with detailed, actionable information. The "documents" array should contain objects with "name" and "description" properties. The "steps" array should contain objects with "step", "title", and "description" properties.
    *   If it's a general explanation, set \`isGuide\` to \`false\`. Provide a \`title\` and a detailed explanation in the \`summary\` field. The \`documents\` and \`steps\` arrays should be empty.
5.  **Language**: The entire response, including all text in the JSON, must be in ${language}.
6.  **Style**: Use simple, easy-to-understand language for a common person with no legal background. Avoid jargon.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    const rawText = response.text;
    
    if (!rawText) {
        throw new Error("API returned an empty response. Please try a different query.");
    }
    
    const parsedData = extractAndParseJson(rawText);

    return { data: parsedData, sources };
  } catch (error) {
    console.error("Error in simplifyTextWithSearch:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a structured explanation from the API. ${error.message}`);
    }
    throw new Error("An unknown error occurred while processing your request.");
  }
}

export async function generateVisualAid(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("API returned no image data.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error in generateVisualAid:", error);
    throw new Error("Failed to generate a visual aid from the API.");
  }
}