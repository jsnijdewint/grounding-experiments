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

// Need to ensure fs/path are available for reading reference images in action if needed, 
// BUT generateQuestionText already reads them. 
// We should probably extract that logic or re-read them here. 
// To avoid duplication, I will just re-read them here for the image generator.

export async function generateExamAction(exercises: Exercise[], imageModel: string = "gemini-3-pro-image-preview") {
    try {
        console.log("Starting Exam Generation with", exercises.length, "exercises using model", imageModel)

        // 1. Generate Text (Step A)
        const { questionData, imageDescription } = await generateQuestionText(exercises)
        console.log("Text Generated:", questionData.title)

        // 2. Generate Image (Step B)
        let imageUrl = null
        if (imageDescription) {
            console.log("Generating Image for:", imageDescription)

            // Collect reference images from input exercises
            const referenceImages: string[] = []
            for (const ex of exercises) {
                for (const ctx of ex.contentContext) {
                    if (ctx.type === 'image' && ctx.media_path) {
                        try {
                            const fullPath = path.join(process.cwd(), 'public', 'alfie_exam_data', ctx.media_path)
                            const imageBuffer = await fs.readFile(fullPath)
                            const base64Image = imageBuffer.toString("base64")
                            referenceImages.push(base64Image)
                        } catch (e) { /* ignore */ }
                    }
                }
            }

            imageUrl = await generateImageBanana(imageDescription, imageModel, referenceImages)
        }

        // 3. Logbook & Save
        const logEntry = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            inputExercises: exercises.map(e => e.id),
            generated: questionData,
            imagePrompt: imageDescription,
            generatedImageUrl: imageUrl,
            modelUsed: imageModel
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
