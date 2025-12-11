"use client"

import { useState, useEffect } from "react"
import ExercisePanel from "@/components/exercise-panel"
import ExercisePreview from "@/components/exercise-preview"
import PromptPreview from "@/components/prompt-preview"
import GeneratedExamPanel from "@/components/generated-exam-panel"
import GenerationDashboard from "@/components/generation-dashboard"
import { getExerciseTree } from "@/app/actions"
import type { Exercise, ExerciseTreeNode } from "@/lib/data-loader"

export default function Home() {
  const [treeData, setTreeData] = useState<ExerciseTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set())
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())
  const [selectedSubdomains, setSelectedSubdomains] = useState<Set<string>>(new Set())

  // Derived state for selected exercises
  const selectedExerciseObjects = findExercisesByIds(treeData, selectedExercises)

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getExerciseTree()
        setTreeData(data)
      } catch (error) {
        console.error('Error loading exercise tree:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="h-screen flex overflow-hidden bg-[#FEF6E1]">
      {/* Left Panel - Tree View (1/5) */}
      <div className="w-1/5 border-r border-border flex flex-col overflow-hidden bg-[#FEF6E1]">
        <ExercisePanel
          treeData={treeData}
          isLoading={isLoading}
          selectedExercises={selectedExercises}
          selectedDomains={selectedDomains}
          selectedSubdomains={selectedSubdomains}
          onSelectionChange={setSelectedExercises}
          onDomainSelectionChange={setSelectedDomains}
          onSubdomainSelectionChange={setSelectedSubdomains}
          onPreviewSelect={() => { }} // No-op, we derive from selection now
        />
      </div>

      {/* Middle Panel - Selected Exercise Preview (2/5) */}
      <div className="w-2/5 border-r border-border flex flex-col overflow-hidden bg-[#FFF9E9]">
        <div className="border-b border-border px-4 py-3 bg-[#377E34]">
          <h2 className="text-lg font-semibold text-[#FFF9E9]">
            Geselecteerde Opgaven{selectedExercises.size > 0 ? ` (${selectedExercises.size})` : ""}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden pointer-events-auto">
          <div className="h-full overflow-y-auto">
            {selectedExerciseObjects.length > 0 ? (
              <div className="divide-y divide-border">
                {selectedExerciseObjects.map((exercise) => (
                  <ExercisePreview
                    key={exercise.id}
                    exercise={exercise}
                    selectedDomains={selectedDomains}
                    selectedSubdomains={selectedSubdomains}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <p className="text-sm text-foreground/60 text-center">
                  Selecteer een of meerdere opgaven in de boomstructuur om de details te bekijken
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Unified Prompt Preview */}
        {selectedExerciseObjects.length > 0 && (
          <PromptPreview
            exercises={selectedExerciseObjects}
            selectedDomains={selectedDomains}
            selectedSubdomains={selectedSubdomains}
          />
        )}
      </div>

      {/* Right Panel - AI Generated Content (2/5) */}
      <div className="w-2/5 flex flex-col overflow-hidden bg-[#FFFCF4]">
        <div className="flex-1 overflow-hidden">
          <GeneratedExamPanel selectedExercises={selectedExerciseObjects} />
        </div>
        <GenerationDashboard />
      </div>
    </div>
  )
}

// Helper to find exercises by IDs
function findExercisesByIds(nodes: ExerciseTreeNode[], ids: Set<string>): Exercise[] {
  const exercises: Exercise[] = []

  function traverse(node: ExerciseTreeNode) {
    if (node.type === "exercise" && ids.has(node.id) && node.exercise) {
      exercises.push(node.exercise)
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  nodes.forEach(traverse)
  return exercises
}
