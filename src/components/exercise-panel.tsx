"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, Info } from "lucide-react"

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

interface ExerciseTreeNode {
  id: string
  label: string
  type: "vak" | "domein" | "subdomein" | "exercise"
  children?: ExerciseTreeNode[]
  exercise?: Exercise
}

const mockData: ExerciseTreeNode[] = [
  {
    id: "wiskunde-b",
    label: "Wiskunde B",
    type: "vak",
    children: [
      {
        id: "domein-b",
        label: "Domein B: Algebra en tellen",
        type: "domein",
        children: [
          {
            id: "subdomein-b1",
            label: "B1: Algebraïsche vaardigheden",
            type: "subdomein",
            children: [
              {
                id: "ex-b1-1",
                label: "Ontbinden in factoren",
                type: "exercise",
                exercise: {
                  id: "ex-b1-1",
                  title: "Ontbinden in factoren",
                  subject: "Wiskunde B",
                  topic: "Algebraïsche vaardigheden",
                  difficulty: "medium",
                  image: "/quadratic-equations-graph.jpg",
                  content:
                    "Gegeven is de vergelijking: x³ - 6x² + 11x - 6 = 0\n\na) Toon aan dat x = 1 een oplossing is.\nb) Ontbind x³ - 6x² + 11x - 6 in factoren.\nc) Los de vergelijking op.",
                  answers: [
                    "a) Invullen: 1 - 6 + 11 - 6 = 0 ✓",
                    "b) (x - 1)(x - 2)(x - 3)",
                    "c) x = 1, x = 2 of x = 3",
                  ],
                  niveau: "VWO",
                  examenjaar: "2023",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "3",
                },
              },
              {
                id: "ex-b1-2",
                label: "Breuken met variabelen",
                type: "exercise",
                exercise: {
                  id: "ex-b1-2",
                  title: "Breuken met variabelen",
                  subject: "Wiskunde B",
                  topic: "Algebraïsche vaardigheden",
                  difficulty: "easy",
                  content:
                    "Vereenvoudig:\n\n(x² - 4) / (x² + 4x + 4)\n\nGeef het domein aan waarvoor de vereenvoudiging geldig is.",
                  answers: ["(x - 2)(x + 2) / (x + 2)² = (x - 2) / (x + 2)", "Domein: x ≠ -2"],
                  niveau: "VWO",
                  examenjaar: "2022",
                  tijdvak: "2e tijdvak",
                  opgavenummer: "7",
                },
              },
            ],
          },
          {
            id: "subdomein-b2",
            label: "B2: Rekenen en redeneren",
            type: "subdomein",
            children: [
              {
                id: "ex-b2-1",
                label: "Inductief bewijzen",
                type: "exercise",
                exercise: {
                  id: "ex-b2-1",
                  title: "Inductief bewijzen",
                  subject: "Wiskunde B",
                  topic: "Rekenen en redeneren",
                  difficulty: "hard",
                  content:
                    "Bewijs met volledige inductie dat voor alle n ∈ ℕ geldt:\n\n1 + 2 + 3 + ... + n = ½n(n + 1)",
                  answers: [
                    "Basisstap: n = 1: 1 = ½·1·2 = 1 ✓",
                    "Inductiestap: Stel de formule geldt voor n = k",
                    "Dan voor n = k+1: ½k(k+1) + (k+1) = ½(k+1)(k+2) ✓",
                  ],
                  niveau: "VWO",
                  examenjaar: "2023",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "12",
                },
              },
            ],
          },
        ],
      },
      {
        id: "domein-c",
        label: "Domein C: Verbanden en functies",
        type: "domein",
        children: [
          {
            id: "subdomein-c1",
            label: "C1: Standaardfuncties",
            type: "subdomein",
            children: [
              {
                id: "ex-c1-1",
                label: "Exponentiële functies",
                type: "exercise",
                exercise: {
                  id: "ex-c1-1",
                  title: "Exponentiële functies",
                  subject: "Wiskunde B",
                  topic: "Standaardfuncties",
                  difficulty: "medium",
                  image: "/linear-equations.jpg",
                  content:
                    "De groei van een bacteriekolk wordt beschreven door:\nN(t) = 500 · 2^(t/3), waarbij t de tijd in uren is.\n\na) Bereken het aantal bacteriën na 6 uur.\nb) Na hoeveel uur zijn er 8000 bacteriën?\nc) Bepaal de verdubbelingstijd.",
                  answers: [
                    "a) N(6) = 500 · 2² = 2000 bacteriën",
                    "b) 8000 = 500 · 2^(t/3) → t = 12 uur",
                    "c) Verdubbelingstijd = 3 uur",
                  ],
                  niveau: "VWO",
                  examenjaar: "2021",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "5",
                },
              },
              {
                id: "ex-c1-2",
                label: "Logaritmische functies",
                type: "exercise",
                exercise: {
                  id: "ex-c1-2",
                  title: "Logaritmische functies",
                  subject: "Wiskunde B",
                  topic: "Standaardfuncties",
                  difficulty: "medium",
                  content: "Los exact op:\n\na) log₂(x) + log₂(x - 2) = 3\nb) 2^(x+1) = 3^(x-1)",
                  answers: ["a) log₂(x(x-2)) = 3 → x² - 2x = 8 → x = 4", "b) x = (ln3 + ln2) / (ln2 - ln3) ≈ -6,13"],
                  niveau: "VWO",
                  examenjaar: "2022",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "8",
                },
              },
            ],
          },
          {
            id: "subdomein-c2",
            label: "C2: Goniometrische functies",
            type: "subdomein",
            children: [
              {
                id: "ex-c2-1",
                label: "Goniometrische vergelijkingen",
                type: "exercise",
                exercise: {
                  id: "ex-c2-1",
                  title: "Goniometrische vergelijkingen",
                  subject: "Wiskunde B",
                  topic: "Goniometrische functies",
                  difficulty: "hard",
                  image: "/triangle-angles.png",
                  content: "Los exact op voor 0 ≤ x < 2π:\n\na) 2sin²(x) - sin(x) - 1 = 0\nb) sin(2x) = cos(x)",
                  answers: [
                    "a) sin(x) = 1 of sin(x) = -½ → x = ½π, 7π/6, 11π/6",
                    "b) 2sin(x)cos(x) = cos(x) → x = 0, π/6, 5π/6, π",
                  ],
                  niveau: "VWO",
                  examenjaar: "2023",
                  tijdvak: "2e tijdvak",
                  opgavenummer: "10",
                },
              },
            ],
          },
        ],
      },
      {
        id: "domein-d",
        label: "Domein D: Veranderingen",
        type: "domein",
        children: [
          {
            id: "subdomein-d1",
            label: "D1: Afgeleide functies",
            type: "subdomein",
            children: [
              {
                id: "ex-d1-1",
                label: "Differentiëren",
                type: "exercise",
                exercise: {
                  id: "ex-d1-1",
                  title: "Differentiëren",
                  subject: "Wiskunde B",
                  topic: "Afgeleide functies",
                  difficulty: "medium",
                  content:
                    "Gegeven is f(x) = x³ - 3x² + 2\n\na) Bereken f'(x).\nb) Bepaal de coördinaten van de extreme waarden.\nc) Onderzoek of het een maximum of minimum betreft.",
                  answers: [
                    "a) f'(x) = 3x² - 6x",
                    "b) f'(x) = 0 → x = 0 of x = 2 → (0, 2) en (2, -2)",
                    "c) f''(x) = 6x - 6; f''(0) = -6 < 0 → max; f''(2) = 6 > 0 → min",
                  ],
                  niveau: "VWO",
                  examenjaar: "2020",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "4",
                },
              },
              {
                id: "ex-d1-2",
                label: "Kettingregel",
                type: "exercise",
                exercise: {
                  id: "ex-d1-2",
                  title: "Kettingregel",
                  subject: "Wiskunde B",
                  topic: "Afgeleide functies",
                  difficulty: "hard",
                  content: "Differentieer:\n\na) f(x) = sin(x²)\nb) g(x) = e^(3x² + 1)\nc) h(x) = ln(cos(x))",
                  answers: [
                    "a) f'(x) = 2x · cos(x²)",
                    "b) g'(x) = 6x · e^(3x² + 1)",
                    "c) h'(x) = -sin(x)/cos(x) = -tan(x)",
                  ],
                  niveau: "VWO",
                  examenjaar: "2021",
                  tijdvak: "2e tijdvak",
                  opgavenummer: "11",
                },
              },
            ],
          },
          {
            id: "subdomein-d2",
            label: "D2: Integraalrekening",
            type: "subdomein",
            children: [
              {
                id: "ex-d2-1",
                label: "Oppervlakte berekenen",
                type: "exercise",
                exercise: {
                  id: "ex-d2-1",
                  title: "Oppervlakte berekenen",
                  subject: "Wiskunde B",
                  topic: "Integraalrekening",
                  difficulty: "medium",
                  image: "/quadratic-equations-graph.jpg",
                  content:
                    "Gegeven zijn f(x) = x² en g(x) = 2x.\n\na) Bepaal de snijpunten van f en g.\nb) Bereken exact de oppervlakte ingesloten door f en g.",
                  answers: ["a) x² = 2x → x = 0 of x = 2", "b) ∫₀² (2x - x²) dx = [x² - ⅓x³]₀² = 4 - 8/3 = 4/3"],
                  niveau: "VWO",
                  examenjaar: "2022",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "6",
                },
              },
            ],
          },
        ],
      },
      {
        id: "domein-f",
        label: "Domein F: Ruimtemeetkunde",
        type: "domein",
        children: [
          {
            id: "subdomein-f1",
            label: "F1: Coördinaten en vectoren",
            type: "subdomein",
            children: [
              {
                id: "ex-f1-1",
                label: "Vectoren in het platte vlak",
                type: "exercise",
                exercise: {
                  id: "ex-f1-1",
                  title: "Vectoren in het platte vlak",
                  subject: "Wiskunde B",
                  topic: "Coördinaten en vectoren",
                  difficulty: "medium",
                  image: "/triangle-angles.png",
                  content:
                    "Gegeven zijn de punten A(1, 3), B(4, 7) en C(6, 1).\n\na) Bereken de vector AB⃗.\nb) Bepaal de lengte van AB.\nc) Bereken de hoek ∠BAC.",
                  answers: [
                    "a) AB⃗ = (3, 4)",
                    "b) |AB| = √(9 + 16) = 5",
                    "c) cos(∠BAC) = (AB⃗ · AC⃗)/(|AB||AC|) → ∠BAC ≈ 53,1°",
                  ],
                  niveau: "VWO",
                  examenjaar: "2023",
                  tijdvak: "1e tijdvak",
                  opgavenummer: "9",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]

interface TreeItemProps {
  node: ExerciseTreeNode
  selectedExercises: Set<string>
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
  onSelectionChange: (id: string) => void
  onDomainSelectionChange: (id: string) => void
  onSubdomainSelectionChange: (id: string) => void
  onPreviewSelect: (exercise: Exercise) => void
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
}: TreeItemProps) {
  const [expanded, setExpanded] = useState(true)
  const isExercise = node.type === "exercise"
  const isDomein = node.type === "domein"
  const isSubdomein = node.type === "subdomein"
  const isSelected = selectedExercises.has(node.id)
  const isDomainSelected = selectedDomains.has(node.id)
  const isSubdomainSelected = selectedSubdomains.has(node.id)

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#FFF9E9] rounded-md cursor-pointer transition-colors ${
          node.type === "vak" ? "mt-1" : ""
        } ${node.type === "domein" ? "ml-1" : ""} ${node.type === "subdomein" ? "ml-2" : ""} ${node.type === "exercise" ? "ml-3" : ""}`}
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
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
              isDomainSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
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
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
              isSubdomainSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
            }`}
          >
            {isSubdomainSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}

        {/* Checkbox for Exercises */}
        {isExercise && (
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isSelected ? "bg-primary border-primary" : "border-border hover:border-primary"
            }`}
          >
            {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </div>
        )}

        {/* Label - subdomein now dark text */}
        <span
          className={`text-xs flex-1 truncate ${
            node.type === "vak"
              ? "font-bold text-foreground"
              : node.type === "domein"
                ? "font-semibold text-foreground"
                : node.type === "subdomein"
                  ? "font-medium text-foreground"
                  : isSelected
                    ? "text-primary font-medium"
                    : "text-foreground"
          }`}
        >
          {node.label}
        </span>
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

interface ExercisePanelProps {
  selectedExercises: Set<string>
  selectedDomains: Set<string>
  selectedSubdomains: Set<string>
  onSelectionChange: (exercises: Set<string>) => void
  onDomainSelectionChange: (domains: Set<string>) => void
  onSubdomainSelectionChange: (subdomains: Set<string>) => void
  onPreviewSelect: (exercise: Exercise) => void
}

export default function ExercisePanel({
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

  return (
    <>
      <div className="border-b border-border px-3 py-2 bg-[#377E34]">
        <h2 className="text-sm font-semibold text-[#FFF9E9]">Domeinen, subdomeinen en examenopgaven</h2>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto px-1 py-2">
        {mockData.map((node) => (
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
        ))}
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

export { mockData }
export type { Exercise, ExerciseTreeNode }
