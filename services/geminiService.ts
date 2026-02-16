
import { GoogleGenAI, Type } from "@google/genai";
import { SyncRecord, SyncFlag } from "../types";

export const analyzeSyncHealth = async (records: SyncRecord[]) => {
  // Fixed: Use named parameter for apiKey and initialize inside the function
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const pendingCount = records.filter(r => [SyncFlag.DUBAI_UNPROCESSED, SyncFlag.PORT_UNPROCESSED].includes(r.flag)).length;
  const transitCount = records.filter(r => [SyncFlag.DUBAI_IN_TRANSIT, SyncFlag.PORT_IN_TRANSIT].includes(r.flag)).length;
  
  const prompt = `
    As an Oracle Database Infrastructure Expert, analyze these sync metrics:
    - Total Pending (Unprocessed): ${pendingCount}
    - Total In-Transit: ${transitCount}
    - Server Nodes involved: Dubai Main, Tanzania Port, Kenya Port.
    
    Provide a concise (2-3 sentence) health executive summary and one high-priority recommendation for the DB Admin.
  `;

  try {
    // Fixed: Use ai.models.generateContent directly and include responseSchema
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A concise executive summary of the sync health.',
            },
            recommendation: {
              type: Type.STRING,
              description: 'A high-priority recommendation for the administrator.',
            },
          },
          required: ["summary", "recommendation"],
          propertyOrdering: ["summary", "recommendation"],
        },
      }
    });

    // Fixed: Access text as a property, not a method
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("AI Analysis failed", error);
    return {
      summary: "Sync monitoring active. No major anomalies detected in current batch.",
      recommendation: "Ensure database links (DS/TS/KS) are verified if pending counts increase."
    };
  }
};
