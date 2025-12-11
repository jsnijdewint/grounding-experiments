"use client"

import { useState } from "react"
import { Settings2, Cpu, ImageIcon, Wand2, ChevronDown, Target } from "lucide-react"

type GenerationMode = "ai" | "afie"

const llmModels = [
  { id: "gemini-3", name: "Gemini 3" },
  { id: "claude-opus-4.5", name: "Claude Opus 4.5" },
  { id: "chatgpt-5.2", name: "ChatGPT 5.2" },
]

const imageGenerators = [
  { id: "gemini-2.5-flash-image", name: "Flash 2.5 Image" },
  { id: "gemini-3-pro-image-preview", name: "Gemini 3 Pro Image (Banana Pro)" },
]

const afieTypes = [
  { id: "toetsje", name: "Toetsje" },
  { id: "variaties", name: "Variaties" },
  { id: "de-mol", name: "De Mol" },
  { id: "verzamel-vier", name: "Verzamel Vier" },
  { id: "flashcards", name: "Flashcards" },
  { id: "vrije-vorm", name: "Vrije vorm" },
  { id: "quizmaster", name: "Quizmaster" },
  { id: "slangen", name: "Slangen" },
]

interface GenerationDashboardProps {
  selectedImageModel?: string
  onImageModelChange?: (id: string) => void
}

export default function GenerationDashboard({ selectedImageModel, onImageModelChange }: GenerationDashboardProps) {
  const [mode, setMode] = useState<GenerationMode>("ai")
  const [selectedLLM, setSelectedLLM] = useState(llmModels[0].id)
  // Use prop if available, else local state (though we pass prop now)
  const [localImageGen, setLocalImageGen] = useState(imageGenerators[1].id)

  const currentImageGen = selectedImageModel || localImageGen
  const handleImageGenChange = (val: string) => {
    setLocalImageGen(val)
    onImageModelChange?.(val)
  }

  const [selectedAfieType, setSelectedAfieType] = useState(afieTypes[0].id)
  const [batchCount, setBatchCount] = useState(1) // Default to 1 as per request "generate 1 exercise"
  const [leerdoel, setLeerdoel] = useState("")

  return (
    <div className="border-t border-border bg-[#FFF9E9] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Settings2 className="w-4 h-4 text-foreground/60" />
        <h3 className="text-sm font-semibold text-foreground">Generatie-instellingen</h3>
      </div>

      <div className="space-y-3">
        {/* Mode Toggle - Updated button colors */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("ai")}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${mode === "ai"
              ? "bg-[#377E34] text-[#FFF9E9]"
              : "bg-[#FFFCF4] text-foreground/60 hover:text-foreground border border-border"
              }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            LLM + Afbeelding
          </button>
          <button
            onClick={() => setMode("afie")}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${mode === "afie"
              ? "bg-[#377E34] text-[#FFF9E9]"
              : "bg-[#FFFCF4] text-foreground/60 hover:text-foreground border border-border"
              }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Afie Materiaal
          </button>
        </div>

        {mode === "ai" ? (
          <div className="grid grid-cols-2 gap-3">
            {/* LLM Selector */}
            <div>
              <label className="text-xs text-foreground/60 mb-1 block flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Taalmodel
              </label>
              <div className="relative">
                <select
                  value={selectedLLM}
                  onChange={(e) => setSelectedLLM(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFCF4] border border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#377E34]/50 text-foreground"
                >
                  {llmModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 pointer-events-none" />
              </div>
            </div>

            {/* Image Generator Selector */}
            <div>
              <label className="text-xs text-foreground/60 mb-1 block flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Beeldgenerator
              </label>
              <div className="relative">
                <select
                  value={currentImageGen}
                  onChange={(e) => handleImageGenChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFFCF4] border border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#377E34]/50 text-foreground"
                >
                  {imageGenerators.map((gen) => (
                    <option key={gen.id} value={gen.id}>
                      {gen.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 pointer-events-none" />
              </div>
            </div>
          </div>
        ) : (
          /* Afie Material Type Selector with Leerdoel field */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-foreground/60 mb-1 block flex items-center gap-1">
                  <Wand2 className="w-3 h-3" />
                  Type lesmateriaal
                </label>
                <div className="relative">
                  <select
                    value={selectedAfieType}
                    onChange={(e) => setSelectedAfieType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FFFCF4] border border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#377E34]/50 text-foreground"
                  >
                    {afieTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60 pointer-events-none" />
                </div>
              </div>

              {/* Leerdoel input */}
              <div>
                <label className="text-xs text-foreground/60 mb-1 block flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Leerdoel
                </label>
                <input
                  type="text"
                  value={leerdoel}
                  onChange={(e) => setLeerdoel(e.target.value)}
                  placeholder="Bijv. differentiëren beheersen"
                  className="w-full px-3 py-2 text-xs bg-[#FFFCF4] border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#377E34]/50 placeholder:text-foreground/40 text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBatchCount(Math.max(1, batchCount - 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#FFFCF4] border border-border rounded-md text-foreground hover:bg-[#FFFEFA] transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium text-foreground">{batchCount}</span>
            <button
              onClick={() => setBatchCount(Math.min(20, batchCount + 1))}
              className="w-7 h-7 flex items-center justify-center bg-[#FFFCF4] border border-border rounded-md text-foreground hover:bg-[#FFFEFA] transition-colors"
            >
              +
            </button>
          </div>
          <button className="flex-1 py-2.5 bg-[#FFB50A] text-[#1F3E5D] text-sm font-medium rounded-md hover:bg-[#FFB50A]/90 transition-colors">
            Genereer {batchCount} materialen
          </button>
        </div>
      </div>
    </div>
  )
}
