import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const NANO_BANANA_PRO = "gemini-3-pro-image-preview";

async function run() {
  try {
    const hasRefImages = true;
    const modelToUse = hasRefImages ? NANO_BANANA_PRO : "gemini-3.1-flash-image-preview";

    console.log("Testing model:", modelToUse);
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: [{ text: "Draw a small product advertisement." }],
    });
    
    console.log("Response came back!");
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if ((part as any)?.inlineData) {
        console.log("IMAGE RETURNED OK");
    } else {
        console.log("TEXT RETURNED:");
        console.log(part);
    }
  } catch (err: any) {
    console.error("ERROR CAUGHT:");
    console.error(err.message || err);
  }
}

run();
