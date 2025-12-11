"use client"

import type { Exercise } from "@/lib/data-loader"

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

interface ExercisePreviewProps {
  exercise: Exercise
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
}

export default function ExercisePreview({ exercise, selectedDomains, selectedSubdomains }: ExercisePreviewProps) {
  const disciplineDisplay = DISCIPLINE_NAMES[exercise.discipline] || exercise.discipline
  const levelDisplay = exercise.educationLevel.toUpperCase().replace('_', '-')
  const tijdvakDisplay = exercise.tijdvak === 1 ? '1e tijdvak' : `${exercise.tijdvak}e tijdvak`

  const generatePrompt = () => {
    const parts: string[] = []

    parts.push(`Genereer een nieuwe examenvraag voor ${disciplineDisplay} op ${levelDisplay} niveau.`)

    if (selectedDomains.size > 0) {
      parts.push(`\n\nGebruik context uit de volgende domeinen: ${Array.from(selectedDomains).join(", ")}.`)
    }

    if (selectedSubdomains.size > 0) {
      parts.push(`\n\nFocus op de subdomeinen: ${Array.from(selectedSubdomains).join(", ")}.`)
    }

    // Include actual domain/subdomain names from the exercise
    if (exercise.domains.length > 0) {
      const domainNames = exercise.domains.map(d => `${d.prefix_code}: ${d.name}`).join(', ')
      parts.push(`\n\nDe voorbeeldvraag valt onder domein(en): ${domainNames}`)
    }
    if (exercise.subdomains.length > 0) {
      const subdomainNames = exercise.subdomains.map(s => `${s.prefix_code}: ${s.name}`).join(', ')
      parts.push(`\n\nSubdomein(en): ${subdomainNames}`)
    }

    parts.push(
      `\n\nBaseer de nieuwe opgave op het type vraagstelling en moeilijkheidsgraad van de volgende voorbeeldopgave:`,
    )
    parts.push(
      `\n\n---\nVoorbeeldopgave (${exercise.examYear} ${tijdvakDisplay}, Vraag ${exercise.questionNumber}):\n${stripHtml(exercise.content)}`,
    )
    parts.push(
      `\n\n---\nZorg dat de nieuwe vraag:\n- Dezelfde structuur heeft (aantal deelvragen)\n- Vergelijkbare complexiteit heeft (max ${exercise.maxScore} punten)\n- Originele getallen/context gebruikt\n- Een volledige uitwerking bevat`,
    )

    return parts.join("")
  }

  // Helper to strip HTML tags from content
  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  }

  // Get first image from content context
  const firstImage = exercise.contentContext.find(c => c.type === 'image')

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border border-border rounded-lg overflow-hidden bg-[#FFFCF4] hover:border-[#377E34]/50 transition-colors">
          <div className="bg-[#377E34] px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-[#FFF9E9]">
              {disciplineDisplay} • {levelDisplay} • {exercise.examYear} • {tijdvakDisplay} • Vraag {exercise.questionNumber}
            </h3>
            <p className="text-sm text-[#FFF9E9]/70 mt-1">
              Maximumscore: {exercise.maxScore} punten
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Content Context (text and images) */}
            {exercise.contentContext.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Context</p>
                {exercise.contentContext.map((item, idx) => (
                  <div key={idx}>
                    {item.type === 'text' && item.text && (
                      <div
                        className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    )}
                    {item.type === 'image' && (
                      <div className="bg-[#FFFEFA] rounded-lg overflow-hidden border border-border">
                        <img
                          src={item.azure_url || `/alfie_exam_data/${item.media_path}`}
                          alt={item.caption || 'Exam image'}
                          className="w-full h-auto max-h-64 object-contain"
                        />
                        {item.caption && (
                          <p className="text-xs text-center text-foreground/60 py-2">{item.caption}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Vraag</p>
              <div
                className="text-sm font-medium text-foreground leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: exercise.content }}
              />
            </div>

            {/* Solution */}
            {exercise.solution.text && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Uitwerking</p>
                <div className="bg-[#FFFEFA] border border-border rounded-lg p-4">
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {exercise.solution.text}
                  </p>
                </div>
              </div>
            )}

            {/* Domain/Subdomain Tags */}
            {(exercise.domains.length > 0 || exercise.subdomains.length > 0) && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Classificatie</p>
                <div className="flex flex-wrap gap-2">
                  {exercise.domains.map(d => (
                    <span key={d.id} className="text-xs bg-[#377E34]/10 text-[#377E34] px-2 py-1 rounded-full">
                      {d.prefix_code}: {d.name}
                    </span>
                  ))}
                  {exercise.subdomains.map(s => (
                    <span key={s.id} className="text-xs bg-[#FFB50A]/20 text-[#8B6914] px-2 py-1 rounded-full">
                      {s.prefix_code}: {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
