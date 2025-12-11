"use client"

interface Exercise {
  id: string
  title: string
  subject: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  image?: string
  content: string
  answers: string[]
  niveau?: string
  examenjaar?: string
  tijdvak?: string
  opgavenummer?: string
}

interface ExercisePreviewProps {
  exercise: Exercise
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
}

export default function ExercisePreview({ exercise, selectedDomains, selectedSubdomains }: ExercisePreviewProps) {
  const mediaTypeLabel = "Afbeelding"

  const generatePrompt = () => {
    const parts: string[] = []

    parts.push(`Genereer een nieuwe examenvraag voor ${exercise.subject} op ${exercise.niveau || "VWO"} niveau.`)

    if (selectedDomains.size > 0) {
      parts.push(`\n\nGebruik context uit de volgende domeinen: ${Array.from(selectedDomains).join(", ")}.`)
    }

    if (selectedSubdomains.size > 0) {
      parts.push(`\n\nFocus op de subdomeinen: ${Array.from(selectedSubdomains).join(", ")}.`)
    }

    parts.push(
      `\n\nBaseer de nieuwe opgave op het type vraagstelling en moeilijkheidsgraad van de volgende voorbeeldopgave:`,
    )
    parts.push(
      `\n\n---\nVoorbeeldopgave (${exercise.examenjaar || ""} ${exercise.tijdvak || ""}, Opgave ${exercise.opgavenummer || ""}):\n${exercise.content}`,
    )
    parts.push(
      `\n\n---\nZorg dat de nieuwe vraag:\n- Dezelfde structuur heeft (aantal deelvragen)\n- Vergelijkbare complexiteit heeft\n- Originele getallen/context gebruikt\n- Een volledige uitwerking bevat`,
    )

    return parts.join("")
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border border-border rounded-lg overflow-hidden bg-[#FFFCF4] hover:border-[#377E34]/50 transition-colors">
          <div className="bg-[#377E34] px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-[#FFF9E9]">
              {exercise.subject} • {exercise.niveau || "VWO"} • {exercise.examenjaar || "2023"} •{" "}
              {exercise.tijdvak || "1e tijdvak"} • Opgave {exercise.opgavenummer || "1"}
            </h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Media Section */}
            {exercise.image && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">{mediaTypeLabel}</p>
                <div className="bg-[#FFFEFA] rounded-lg overflow-hidden border border-border">
                  <img src={exercise.image || "/placeholder.svg"} alt={exercise.title} className="w-full h-auto" />
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line">
                {exercise.content}
              </p>
            </div>

            {/* Answers - unified in one box */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Uitwerkingen</p>
              <div className="bg-[#FFFEFA] border border-border rounded-lg p-4">
                <div className="space-y-2">
                  {exercise.answers.map((answer, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      {answer}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-[#FFF9E9]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-foreground">Automatisch gegenereerde prompt</span>
          <span className="text-xs text-foreground/60">(grounding voor AI)</span>
        </div>
        <div className="bg-[#FFFCF4] border border-border rounded-lg p-3 max-h-32 overflow-y-auto">
          <p className="text-xs text-foreground whitespace-pre-line font-mono leading-relaxed">{generatePrompt()}</p>
        </div>
      </div>
    </div>
  )
}
