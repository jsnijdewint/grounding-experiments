'use server'

import { generateQuestionText, generateImageBanana } from "@/lib/gemini-client"
import { Exercise } from "@/lib/data-loader"
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid' // Need to install uuid or use crypto

// Simple UUID if package not present (I'll implement simple random for now to avoid install if possible, or use crypto)
function generateId() {
    return Math.random().toString(36).substring(2, 15)
}

export async function generateExamAction(exercises: Exercise[]) {
    try {
        console.log("Starting Exam Generation with", exercises.length, "exercises")

        // 1. Generate Text (Step A)
        const { questionData, imageDescription } = await generateQuestionText(exercises)
        console.log("Text Generated:", questionData.title)

        // 2. Generate Image (Step B)
        let imageUrl = null
        if (imageDescription) {
            console.log("Generating Image for:", imageDescription)
            // Note: The client logic currently returns a static path because we don't have the API URL.
            // If we had the base64, we would save it here.
            // Assuming generateImageBanana returns a BASE64 string or a URL.
            // Let's pretend it returns a base64 string for the sake of the requirement "save locally".
            // But my placeholder returned a path. I will adjust implementation when I have the real API.
            // For now, I'll stick to the placeholder path returned.
            imageUrl = await generateImageBanana(imageDescription)
        }

        // 3. Logbook & Save
        const logEntry = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            inputExercises: exercises.map(e => e.id),
            generated: questionData,
            imagePrompt: imageDescription,
            generatedImageUrl: imageUrl
        }

        const logPath = path.join(process.cwd(), 'generation_logbook.json')

        // Append to logbook (read, push, write)
        let logbook = []
        try {
            const existing = await fs.readFile(logPath, 'utf-8')
            logbook = JSON.parse(existing)
        } catch (e) {
            // File might not exist
        }
        logbook.push(logEntry)
        await fs.writeFile(logPath, JSON.stringify(logbook, null, 2))

        // 4. Transform to UI format
        // Map the Gemini JSON to the GeneratedQuestion interface expected by the UI
        const uiQuestion = {
            id: logEntry.id,
            number: 1, // Fixed for now
            title: questionData.title,
            media: imageUrl ? {
                type: "image", // Simplified
                url: imageUrl,
                alt: questionData.imageDescription || "Generated Image"
            } : undefined,
            questions: questionData.questions.map((q: any, idx: number) => ({
                id: `${logEntry.id}-q${idx}`,
                text: q.text,
                points: q.points,
                subQuestions: q.subQuestions?.map((sq: any, sidx: number) => ({
                    id: `${logEntry.id}-q${idx}-s${sidx}`,
                    label: sq.label || String.fromCharCode(97 + sidx),
                    text: sq.text,
                    points: sq.points
                }))
            })),
            difficulty: questionData.difficulty || 'medium'
        }

        return [uiQuestion]

    } catch (error) {
        console.error("Generation Failed:", error)
        try {
            await fs.writeFile('generation_error.log', `[${new Date().toISOString()}] Error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\n`)
        } catch (e) { }
        return [] // Return empty or handle error
    }
}
