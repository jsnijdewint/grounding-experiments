"use client"

import { useState, useEffect } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
import GeneratedQuestionComponent from "./generated-question"

interface Exercise {
  id: string
  title: string
  subject: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  image?: string
  content: string
  answers: string[]
}

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
  selectedExercises: Set<string>
}

// Mock generated exam data
const generateMockExam = (count: number): GeneratedQuestion[] => {
  const templates: GeneratedQuestion[] = [
    {
      id: "q1",
      number: 1,
      title: "Differentiëren",
      media: {
        type: "graph",
        url: "/quadratic-equations-graph.jpg",
        alt: "Grafiek van functie f",
      },
      questions: [
        {
          id: "q1-1",
          text: "Gegeven is de functie f(x) = x³ - 6x² + 9x + 2. De grafiek van f is hierboven weergegeven.",
          points: 12,
          subQuestions: [
            {
              id: "q1-1a",
              label: "a",
              text: "Bereken f'(x) en bepaal de extreme waarden van f.",
              points: 4,
            },
            {
              id: "q1-1b",
              label: "b",
              text: "Onderzoek of de extreme waarden een maximum of minimum zijn.",
              points: 3,
            },
            {
              id: "q1-1c",
              label: "c",
              text: "Bepaal de vergelijking van de raaklijn aan de grafiek van f in het punt met x = 0.",
              points: 5,
            },
          ],
        },
      ],
      difficulty: "medium",
    },
    {
      id: "q2",
      number: 2,
      title: "Goniometrie",
      media: {
        type: "diagram",
        url: "/triangle-angles.png",
        alt: "Driehoek ABC",
      },
      questions: [
        {
          id: "q2-1",
          text: "In driehoek ABC geldt: AB = 8, AC = 6 en ∠BAC = 60°.",
          points: 10,
          subQuestions: [
            {
              id: "q2-1a",
              label: "a",
              text: "Bereken exact de lengte van BC met behulp van de cosinusregel.",
              points: 4,
            },
            {
              id: "q2-1b",
              label: "b",
              text: "Bereken de oppervlakte van driehoek ABC.",
              points: 3,
            },
            {
              id: "q2-1c",
              label: "c",
              text: "Bereken ∠ABC in graden nauwkeurig.",
              points: 3,
            },
          ],
        },
      ],
      difficulty: "medium",
    },
    {
      id: "q3",
      number: 3,
      title: "Integraalrekening",
      media: {
        type: "graph",
        url: "/linear-equations.jpg",
        alt: "Grafieken van f en g",
      },
      questions: [
        {
          id: "q3-1",
          text: "Gegeven zijn f(x) = 4 - x² en g(x) = x + 2. De grafieken van f en g zijn hierboven weergegeven.",
          points: 14,
          subQuestions: [
            {
              id: "q3-1a",
              label: "a",
              text: "Bereken algebraïsch de coördinaten van de snijpunten van f en g.",
              points: 4,
            },
            {
              id: "q3-1b",
              label: "b",
              text: "Bereken exact de oppervlakte van het gebied ingesloten door de grafieken van f en g.",
              points: 6,
            },
            {
              id: "q3-1c",
              label: "c",
              text: "Het vlakdeel wordt gewenteld om de x-as. Stel een integraal op voor de inhoud van het omwentelingslichaam.",
              points: 4,
            },
          ],
        },
        {
          id: "q3-2",
          text: "Leg uit waarom de oppervlakte onder de grafiek van f(x) = 4 - x² op het interval [-2, 2] gelijk is aan 32/3.",
          points: 3,
        },
      ],
      difficulty: "hard",
    },
  ]

  return templates.slice(0, count)
}

export default function GeneratedExamPanel({ selectedExercises }: GeneratedExamPanelProps) {
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Auto-generate exam when selections change
  useEffect(() => {
    if (selectedExercises.size > 0) {
      setIsGenerating(true)
      // Simulate API call
      const timer = setTimeout(() => {
        const count = Math.min(Math.max(selectedExercises.size, 1), 3)
        setGeneratedQuestions(generateMockExam(count))
        setIsGenerating(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setGeneratedQuestions([])
    }
  }, [selectedExercises])

  const totalPoints = generatedQuestions.reduce((acc, q) => {
    return acc + q.questions.reduce((qAcc, question) => qAcc + (question.points || 0), 0)
  }, 0)

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
          {generatedQuestions.length > 0 && (
            <button
              onClick={() => setGeneratedQuestions(generateMockExam(generatedQuestions.length))}
              className="p-2 hover:bg-[#FFF9E9]/20 rounded-md transition-colors text-[#FFF9E9]"
              aria-label="Opnieuw genereren"
            >
              <RefreshCw className="w-4 h-4" />
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
                Selecteer een of meer opgaven uit het linkerpaneel om AI-gegenereerd lesmateriaal te maken
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
