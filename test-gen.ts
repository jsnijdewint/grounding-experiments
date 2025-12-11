import { generateQuestionText, generateImageBanana } from "./src/lib/gemini-client";
import { GoogleGenAI } from "@google/genai";
// import { loadExerciseTree } from "./src/lib/data-loader"; 

async function test() {
    console.log("Starting API Test...");

    // List models
    try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_3_API_KEY });
        console.log("Listing Models...");
        const response = await client.models.list();
        // @ts-ignore
        for (const m of response.models) {
            console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
        }
    } catch (e) {
        console.error("Failed to list models:", e);
    }

    const mockExercise = {
        id: "mock-1",
        title: "Test Opgave",
        subject: "Natuurkunde",
        topic: "Beweging",
        difficulty: "medium",
        content: "Een auto rijdt met een constante snelheid van 20 m/s gedurende 10 seconden. Daarna remt hij eenparig af tot stilstand in 5 seconden.",
        solution: { text: "Afstand = oppervlakte onder v,t-grafiek." },
        contentContext: [] as any[],
        answers: [],
        type: "open",
        // Add other required fields if strictly typed, but let's see if partial works or cast
    } as any;

    console.log("Testing Text Generation...");
    try {
        const result = await generateQuestionText([mockExercise]);
        const { questionData, imageDescription } = result;

        console.log("Text Gen Success!");
        console.log("Title:", questionData.title);
        console.log("Img Desc:", imageDescription);

        if (imageDescription) {
            console.log("Testing Image Generation with prompt:", imageDescription);
            const imgPath = await generateImageBanana(imageDescription);
            console.log("Image Gen Result Path:", imgPath);
        } else {
            console.log("No description returned to test image gen.");
        }
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

test();
