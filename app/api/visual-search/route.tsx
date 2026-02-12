import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // 1. Upload to Gemini File API
    // This handles resizing and format conversion (HEIC/PNG/JPG) automatically
    const uploadedFile = await ai.files.upload({
      file: file,
      config: { mimeType: file.type },
    });

    // 2. Identification Prompt
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
        {
          text: `You are an expert produce identifier for a local Nigerian agricultural marketplace. 
         Focus ONLY on the primary subject. 
         
         CRITICAL RULES:
         1. Use common Nigerian English market names. 
         2. For Vigna unguiculata, return "Beans" (NOT Cowpeas).
         3. For all varieties of Capsicum (bell pepper, habanero, etc.), return "Pepper".
         4. For Zea mays, return "Maize" or "Corn".
         5. For Manihot esculenta, return "Cassava".
         6. For all varieties of Solanum tuberosum, return "Potatoes".
         7. For all varieties of Dioscorea rotundata, return "Yam".
         8. For Oryza sativa, return "Rice".
         
         Return ONLY the single common name. No sentences. No punctuation. No scientific names.`,
        },
      ],
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error("Visual Search Error:", error);
    return NextResponse.json(
      { error: "Identification failed" },
      { status: 500 },
    );
  }
}
