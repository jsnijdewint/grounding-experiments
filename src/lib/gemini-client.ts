
import { GoogleGenAI } from "@google/genai"
import { Exercise } from "./data-loader"
import fs from 'fs/promises'
import path from 'path'

const GEMINI_API_KEY = process.env.GEMINI_3_API_KEY
const BANANA_API_KEY = process.env.GEMINI_NANO_BANANA_KEY

// Initialize Main Client (Gemini 3)
const textClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Initialize Image Client (Nano Banana / Gemini 3 Image)
const imageClient = new GoogleGenAI({ apiKey: BANANA_API_KEY });

export async function generateQuestionText(exercises: Exercise[]): Promise<{ questionData: any, imageDescription: string }> {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_3_API_KEY is not set")

    let promptText = `You are an expert Dutch high school exam creator. Your task is to create ONE new, high-quality exam question based on the provided examples.
    
    Output MUST be a valid JSON object with the following structure:
    {
      "title": "Short descriptive title",
      "difficulty": "easy" | "medium" | "hard",
       "questions": [
        {
          "text": "The actual question text...",
          "points": 5,
          "subQuestions": [ 
             { "label": "a", "text": "Subquestion text...", "points": 2 }
          ]
        }
      ],
      "imageDescription": "A highly detailed, visual description of an image that should accompany this question. Describe the objects, layout, style (academic, schematic, photo-realistic), and scientific accuracy required. This text will be sent to an image generator."
    }

    The question should be:
    1.  Scientifically accurate.
    2.  In Dutch.
    3.  Similar in style and complexity to the provided examples.
    4.  Original (do not copy the examples).

    Here are the examples:`

    const parts: any[] = [{ text: promptText }]

    for (const ex of exercises) {
        parts.push({ text: `\n\nExample Question:\n${ex.content}\n\nSolution/Context:\n${ex.solution.text}` })

        for (const ctx of ex.contentContext) {
            if (ctx.type === 'image' && ctx.media_path) {
                try {
                    const fullPath = path.join(process.cwd(), 'public', 'alfie_exam_data', ctx.media_path)
                    const imageBuffer = await fs.readFile(fullPath)
                    const base64Image = imageBuffer.toString("base64")

                    parts.push({
                        inlineData: {
                            data: base64Image,
                            mimeType: "image/png"
                        }
                    })
                } catch (e) {
                    console.warn("Failed to load example image", ctx.media_path)
                }
            }
        }
    }

    try {
        // Updated to use @google/genai generateContent signature
        const response = await textClient.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: [{ parts: parts }],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) throw new Error("No text response from Gemini");

        const parsed = JSON.parse(responseText);

        return {
            questionData: parsed,
            imageDescription: parsed.imageDescription
        }

    } catch (error) {
        console.error("Text Generation Error:", error)
        throw error
    }
}


export async function generateImageBanana(prompt: string): Promise<string | null> {
    if (!BANANA_API_KEY) {
        console.warn("GEMINI_NANO_BANANA_KEY not set")
        return "/window.svg"
    }

    try {
        console.log("Generating image with prompt:", prompt)

        // Using generateContent for Image Generation as per SDK docs/snippets
        const response = await imageClient.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: [{
                parts: [{ text: prompt }]
            }],
            config: {
                responseModalities: ['IMAGE']
            }
        });

        // Find the image part
        let imageBytes = null;
        const parts = response.candidates?.[0]?.content?.parts || [];

        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                imageBytes = part.inlineData.data;
                break;
            }
        }

        if (!imageBytes) {
            throw new Error("No image inlineData found in response");
        }

        const imageId = Math.random().toString(36).substring(7)
        const fileName = `gen-${imageId}.png`
        const publicPath = `/generated-images/${fileName}`
        const diskPath = path.join(process.cwd(), 'public', 'generated-images', fileName)

        const buffer = Buffer.from(imageBytes, 'base64')
        await fs.writeFile(diskPath, buffer)

        return publicPath

    } catch (error) {
        console.error("Image Generation Error:", error)
        try {
            // @ts-ignore
            await fs.appendFile('debug_error.log', `[${new Date().toISOString()}] Image Gen Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\n`)
        } catch (e) { /* ignore */ }
        return null
    }
}
