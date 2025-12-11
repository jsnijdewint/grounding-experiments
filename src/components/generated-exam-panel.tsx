"use client"

import { useState, useEffect } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
import GeneratedQuestionComponent from "./generated-question"
import { generateExamAction } from "@/app/generate-actions"
import type { Exercise } from "@/lib/data-loader"

interface GeneratedQuestion {
  id: string
  number: number
  title: string
  media?: {
    type: "image" | "graph" | "diagram"
    url: string
    alt: string
  }
  questions: {
    id: string
    text: string
    points?: number
    subQuestions?: {
      id: string
      label: string
      text: string
      points?: number
    }[]
  }[]
  difficulty: "easy" | "medium" | "hard"
}

interface GeneratedExamPanelProps {
  selectedExercises: Exercise[]
  imageModel: string
}

export default function GeneratedExamPanel({ selectedExercises, imageModel }: GeneratedExamPanelProps) {
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Manual generation trigger
  const handleGenerate = async () => {
    if (selectedExercises.length > 0) {
      setIsGenerating(true)
      setGeneratedQuestions([]) // Clear previous
      try {
        const result = await generateExamAction(selectedExercises, imageModel)
        // @ts-ignore
        setGeneratedQuestions(result)
      } catch (e) {
        console.error(e)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  // Effect to just clear if empty
  useEffect(() => {
    if (selectedExercises.length === 0) {
      setGeneratedQuestions([])
    }
  }, [selectedExercises])

  return (
    <div className="h-full flex flex-col bg-[#FFFCF4]">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 bg-[#377E34]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#FFF9E9] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFB50A]" />
              AI Gegenereerd Lesmateriaal
            </h2>
          </div>
          {selectedExercises.length > 0 && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`p-2 rounded-md transition-colors text-[#FFF9E9] ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FFF9E9]/20'}`}
              aria-label="Opnieuw genereren"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#377E34] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-foreground/60">Lesmateriaal genereren...</p>
            </div>
          </div>
        ) : generatedQuestions.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-foreground/60 mb-2">Nog geen lesmateriaal gegenereerd</p>
              <p className="text-xs text-foreground/50">
                Selecteer een of meer opgaven uit het linkerpaneel en klik op de knop om lesmateriaal te maken
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {generatedQuestions.map((question) => (
              <GeneratedQuestionComponent key={question.id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
