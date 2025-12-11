"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, Info, Loader2 } from "lucide-react"
import type { Exercise, ExerciseTreeNode } from "@/lib/data-loader"

// Re-export types for use in other components
export type { Exercise, ExerciseTreeNode }

interface TreeItemProps {
  node: ExerciseTreeNode
  selectedExercises: Set<string>
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
  onSelectionChange: (id: string) => void
  onDomainSelectionChange: (id: string) => void
  onSubdomainSelectionChange: (id: string) => void
  onPreviewSelect: (exercise: Exercise) => void
  defaultExpanded?: boolean
}

function TreeItem({
  node,
  selectedExercises,
  selectedDomains,
  selectedSubdomains,
  onSelectionChange,
  onDomainSelectionChange,
  onSubdomainSelectionChange,
  onPreviewSelect,
  defaultExpanded = false,
}: TreeItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const isExercise = node.type === "exercise"
  const isDomein = node.type === "domein"
  const isSubdomein = node.type === "subdomein"
  const isVak = node.type === "vak"
  const isSelected = selectedExercises.has(node.id)
  const isDomainSelected = selectedDomains.has(node.id)
  const isSubdomainSelected = selectedSubdomains.has(node.id)

  // Count children for display
  const childCount = node.children?.length || 0
  const exerciseCount = countExercises(node)

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#FFF9E9] rounded-md cursor-pointer transition-colors ${isVak ? "mt-1" : ""
          } ${isDomein ? "ml-1" : ""} ${isSubdomein ? "ml-2" : ""} ${isExercise ? "ml-3" : ""}`}
        onClick={() => {
          if (isExercise) {
            onSelectionChange(node.id)
            if (node.exercise) onPreviewSelect(node.exercise)
          } else {
            setExpanded(!expanded)
          }
        }}
      >
        {/* Expand/Collapse Button */}
        {!isExercise && node.children && (
          <button className="p-0 hover:bg-primary/10 rounded flex-shrink-0">
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-primary" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            )}
          </button>
        )}
        {isExercise && <div className="w-3.5" />}

        {isDomein && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              onDomainSelectionChange(node.id)
            }}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${isDomainSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
              }`}
          >
            {isDomainSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}

        {isSubdomein && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSubdomainSelectionChange(node.id)
            }}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${isSubdomainSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
              }`}
          >
            {isSubdomainSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}

        {/* Checkbox for Exercises */}
        {isExercise && (
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
              }`}
          >
            {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}

        {/* Label */}
        <span
          className={`text-xs flex-1 truncate ${isVak
              ? "font-bold text-foreground"
              : isDomein
                ? "font-semibold text-foreground"
                : isSubdomein
                  ? "font-medium text-foreground"
                  : isSelected
                    ? "text-primary font-medium"
                    : "text-foreground"
            }`}
        >
          {node.label}
        </span>

        {/* Exercise count badge for non-exercises */}
        {!isExercise && exerciseCount > 0 && (
          <span className="text-[10px] text-foreground/50 bg-foreground/5 px-1.5 py-0.5 rounded-full">
            {exerciseCount}
          </span>
        )}
      </div>

      {/* Children */}
      {expanded && node.children && (
        <div className="pl-1">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedExercises={selectedExercises}
              selectedDomains={selectedDomains}
              selectedSubdomains={selectedSubdomains}
              onSelectionChange={onSelectionChange}
              onDomainSelectionChange={onDomainSelectionChange}
              onSubdomainSelectionChange={onSubdomainSelectionChange}
              onPreviewSelect={onPreviewSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to count exercises in a tree node
function countExercises(node: ExerciseTreeNode): number {
  if (node.type === "exercise") return 1
  if (!node.children) return 0
  return node.children.reduce((sum, child) => sum + countExercises(child), 0)
}

interface ExercisePanelProps {
  treeData: ExerciseTreeNode[]
  isLoading?: boolean
  selectedExercises: Set<string>
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
  onSelectionChange: (exercises: Set<string>) => void
  onDomainSelectionChange: (domains: Set<string>) => void
  onSubdomainSelectionChange: (subdomains: Set<string>) => void
  onPreviewSelect: (exercise: Exercise) => void
}

export default function ExercisePanel({
  treeData,
  isLoading = false,
  selectedExercises,
  selectedDomains,
  selectedSubdomains,
  onSelectionChange,
  onDomainSelectionChange,
  onSubdomainSelectionChange,
  onPreviewSelect,
}: ExercisePanelProps) {
  const handleSelection = (id: string) => {
    const newSelected = new Set(selectedExercises)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  const handleDomainSelection = (id: string) => {
    const newSelected = new Set(selectedDomains)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onDomainSelectionChange(newSelected)
  }

  const handleSubdomainSelection = (id: string) => {
    const newSelected = new Set(selectedSubdomains)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSubdomainSelectionChange(newSelected)
  }

  // Calculate total exercise count
  const totalExercises = treeData.reduce((sum, node) => sum + countExercises(node), 0)

  return (
    <>
      <div className="border-b border-border px-3 py-2 bg-[#377E34]">
        <h2 className="text-sm font-semibold text-[#FFF9E9]">
          Domeinen, subdomeinen en examenopgaven
          {!isLoading && totalExercises > 0 && (
            <span className="ml-2 font-normal opacity-80">({totalExercises} vragen)</span>
          )}
        </h2>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto px-1 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-[#377E34]" />
            <span className="ml-2 text-sm text-foreground/60">Data laden...</span>
          </div>
        ) : treeData.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-foreground/60">Geen data gevonden</p>
          </div>
        ) : (
          treeData.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              selectedExercises={selectedExercises}
              selectedDomains={selectedDomains}
              selectedSubdomains={selectedSubdomains}
              onSelectionChange={handleSelection}
              onDomainSelectionChange={handleDomainSelection}
              onSubdomainSelectionChange={handleSubdomainSelection}
              onPreviewSelect={onPreviewSelect}
            />
          ))
        )}
      </div>

      <div className="border-t border-border px-3 py-3 bg-[#FFF9E9]">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-foreground/60" />
          <span className="text-xs font-medium text-foreground">Selectieoverzicht</span>
        </div>
        <div className="border border-border rounded-md p-2 bg-[#FFFCF4] space-y-1 text-xs">
          <p className="text-foreground">
            <span className="font-medium">{selectedExercises.size}</span> opgave(n) geselecteerd
          </p>
          <p className="text-foreground">
            <span className="font-medium">{selectedDomains.size}</span> domein(en) meesturen
          </p>
          <p className="text-foreground">
            <span className="font-medium">{selectedSubdomains.size}</span> subdomein(en) meesturen
          </p>
        </div>
      </div>
    </>
  )
}
