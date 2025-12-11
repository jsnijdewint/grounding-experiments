"use client"

interface SubQuestion {
  id: string
  label: string
  text: string
  points?: number
}

interface Question {
  id: string
  text: string
  points?: number
  subQuestions?: SubQuestion[]
}

interface Media {
  type: "image" | "graph" | "diagram"
  url: string
  alt: string
}

interface GeneratedQuestionProps {
  question: {
    id: string
    number: number
    title: string
    media?: Media
    questions: Question[]
    difficulty: "easy" | "medium" | "hard"
  }
}

export default function GeneratedQuestion({ question }: GeneratedQuestionProps) {
  const mediaTypeLabel = {
    image: "Afbeelding",
    graph: "Grafiek",
    diagram: "Diagram",
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-[#FFFEFA] hover:border-[#377E34]/50 transition-colors">
      {/* Question Header */}
      <div className="bg-[#377E34] px-6 py-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#FFF9E9]">
              Opgave {question.number}: {question.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Media Section */}
        {question.media && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
              {mediaTypeLabel[question.media.type]}
            </p>
            <div className="bg-[#FFFCF4] rounded-lg overflow-hidden border border-border">
              <img src={question.media.url || "/placeholder.svg"} alt={question.media.alt} className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-5">
          {question.questions.map((q, qIndex) => (
            <div key={q.id} className="space-y-3">
              {/* Main Question with points */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{q.text}</p>
                  {q.points && !q.subQuestions && (
                    <span className="text-xs font-medium text-[#377E34] whitespace-nowrap">{q.points}p</span>
                  )}
                </div>
              </div>

              {/* Sub Questions */}
              {q.subQuestions && (
                <div className="ml-4 space-y-3">
                  {q.subQuestions.map((subQ) => (
                    <div key={subQ.id} className="space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold text-[#377E34]">{subQ.label})</span> {subQ.text}
                        </p>
                        {subQ.points && (
                          <span className="text-xs font-medium text-foreground/60 whitespace-nowrap">
                            {subQ.points}p
                          </span>
                        )}
                      </div>
                      {/* Answer Space */}
                      <div className="mt-2 mb-4">
                        <div className="border-b-2 border-dashed border-border min-h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Space for Main Question (if no sub-questions) */}
              {!q.subQuestions && (
                <div className="mt-3 mb-4">
                  <div className="border-b-2 border-dashed border-border min-h-12" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
