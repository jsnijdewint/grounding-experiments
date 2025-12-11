"use client"

import type { Exercise } from "@/lib/data-loader"
import MarkdownRenderer from "./markdown-renderer"

// Discipline display names
const DISCIPLINE_NAMES: Record<string, string> = {
    'biologie': 'Biologie',
    'scheikunde': 'Scheikunde',
    'natuurkunde': 'Natuurkunde',
    'wiskunde_a': 'Wiskunde A',
    'wiskunde_b': 'Wiskunde B',
    'wiskunde_c': 'Wiskunde C',
    'economie': 'Economie',
    'bedrijfseconomie': 'Bedrijfseconomie',
    'aardrijkskunde': 'Aardrijkskunde',
    'geschiedenis': 'Geschiedenis',
    'maatschappijwetenschappen': 'Maatschappijwetenschappen',
    'maatschappijkunde': 'Maatschappijkunde',
    'engels': 'Engels',
    'nederlands': 'Nederlands',
    'duits': 'Duits',
    'frans': 'Frans',
    'spaans': 'Spaans',
    'geschiedenis_en_staatsinrichting': 'Geschiedenis en Staatsinrichting',
    'natuur_en_scheikunde_1': 'Natuur- en Scheikunde 1',
    'natuur_en_scheikunde_2': 'Natuur- en Scheikunde 2',
    'wiskunde': 'Wiskunde',
}

interface PromptPreviewProps {
    exercises: Exercise[]
    selectedDomains: Set<string>
    selectedSubdomains: Set<string>
}

export default function PromptPreview({ exercises, selectedDomains, selectedSubdomains }: PromptPreviewProps) {
    if (exercises.length === 0) return null

    // Helper to strip HTML tags from content
    function stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    }

    const generatePrompt = () => {
        const parts: string[] = []

        // Use the first exercise to determine discipline/level (assuming they are consistent)
        const firstExercise = exercises[0]
        const disciplineDisplay = DISCIPLINE_NAMES[firstExercise.discipline] || firstExercise.discipline
        const levelDisplay = firstExercise.educationLevel.toUpperCase().replace('_', '-')

        parts.push(`Genereer een nieuwe examenvraag voor ${disciplineDisplay} op ${levelDisplay} niveau.`)

        if (selectedDomains.size > 0) {
            parts.push(`\n\nGebruik context uit de volgende domeinen: ${Array.from(selectedDomains).join(", ")}.`)
        }

        if (selectedSubdomains.size > 0) {
            parts.push(`\n\nFocus op de subdomeinen: ${Array.from(selectedSubdomains).join(", ")}.`)
        }

        parts.push(`\n\nBaseer de nieuwe opgave op het type vraagstelling en moeilijkheidsgraad van de volgende voorbeeldopgaven:`)

        exercises.forEach((exercise, index) => {
            const tijdvakDisplay = exercise.tijdvak === 1 ? '1e tijdvak' : `${exercise.tijdvak}e tijdvak`

            // Include actual domain/subdomain names from the exercise
            let domainInfo = ""
            if (exercise.domains.length > 0) {
                const domainNames = exercise.domains.map(d => `${d.prefix_code}: ${d.name}`).join(', ')
                domainInfo += `\nDomein(en): ${domainNames}`
            }
            if (exercise.subdomains.length > 0) {
                const subdomainNames = exercise.subdomains.map(s => `${s.prefix_code}: ${s.name}`).join(', ')
                domainInfo += `\nSubdomein(en): ${subdomainNames}`
            }

            parts.push(
                `\n\n---\nVoorbeeld ${index + 1} (${exercise.examYear} ${tijdvakDisplay}, Vraag ${exercise.questionNumber})${domainInfo}:\n${stripHtml(exercise.content)}`,
            )
        })

        parts.push(
            `\n\n---\nZorg dat de nieuwe vraag:\n- Een vergelijkbare structuur en complexiteit heeft als de voorbeelden\n- Originele getallen en context gebruikt\n- Een volledige uitwerking bevat`,
        )

        return parts.join("")
    }

    return (
        <div className="border-t border-border p-4 bg-[#FFF9E9]">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-foreground">Automatisch gegenereerde prompt</span>
                <span className="text-xs text-foreground/60">(grounding voor AI)</span>
            </div>
            <div className="bg-[#FFFCF4] border border-border rounded-lg p-3 max-h-48 overflow-y-auto">
                <MarkdownRenderer content={generatePrompt()} className="text-xs text-foreground font-mono leading-relaxed" />
            </div>
        </div>
    )
}
