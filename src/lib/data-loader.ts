import fs from 'fs'
import path from 'path'

// Data path relative to project root
const DATA_PATH = path.join(process.cwd(), 'alfie_exam_data')

// Types matching the JSON structure
interface EducationLevelDiscipline {
    id: number
    discipline_id: number
    education_level_id: number
}

interface Domain {
    id: number
    name: string
    prefix_code: string
    education_level_discipline: number
}

interface Subdomain {
    id: number
    name: string
    domain: number
    prefix_code: number | string
}

interface QuestionMetadata {
    exam: {
        education_level: string
        discipline: string
        year: number
        tijdvak: number
    }
    curriculum: {
        education_level_discipline_id: number
        domains: { id: number; name: string; prefix_code: string }[]
        subdomains: { id: number; name: string; prefix_code: number | string }[]
        sub_learning_objective_ids: number[]
    }
}

interface ContentContextItem {
    order: number
    type: 'text' | 'image'
    text?: string
    media_path?: string
    azure_url?: string
    caption?: string
}

interface QuestionData {
    id: string
    metadata: QuestionMetadata
    question: {
        text: string
        max_score: number
        is_self_scored: boolean
    }
    solution: {
        text: string
        image: string | null
    }
    content_context: ContentContextItem[]
    bijlages: { name: string; media_path: string; azure_url: string }[]
}

// Export types for use in components
export interface Exercise {
    id: string
    title: string
    educationLevel: string
    discipline: string
    difficulty: 'easy' | 'medium' | 'hard'
    content: string
    contentContext: ContentContextItem[]
    maxScore: number
    examYear: number
    tijdvak: number
    questionNumber: string
    domains: { id: number; name: string; prefix_code: string }[]
    subdomains: { id: number; name: string; prefix_code: number | string }[]
    solution: { text: string; image: string | null }
    bijlages: { name: string; media_path: string; azure_url: string }[]
}

export interface ExerciseTreeNode {
    id: string
    label: string
    type: 'vak' | 'domein' | 'subdomein' | 'exercise'
    children?: ExerciseTreeNode[]
    exercise?: Exercise
}

// Education level display names
const EDUCATION_LEVEL_NAMES: Record<string, string> = {
    'vwo': 'VWO',
    'havo': 'HAVO',
    'vmbo_gl': 'VMBO-GL',
    'vmbo_tl': 'VMBO-TL',
    'vmbo_kb': 'VMBO-KB',
    'vmbo_bb': 'VMBO-BB',
}

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

function getDifficultyFromScore(maxScore: number): 'easy' | 'medium' | 'hard' {
    if (maxScore <= 2) return 'easy'
    if (maxScore <= 4) return 'medium'
    return 'hard'
}

function getDisplayName(level: string, discipline: string): string {
    const levelName = EDUCATION_LEVEL_NAMES[level] || level.toUpperCase()
    const disciplineName = DISCIPLINE_NAMES[discipline] || discipline.charAt(0).toUpperCase() + discipline.slice(1).replace(/_/g, ' ')
    return `${levelName} ${disciplineName}`
}

function extractQuestionNumber(questionId: string): string {
    const match = questionId.match(/q(\d+)$/)
    return match ? match[1] : '?'
}

// Load all curriculum and question data and build the tree
export async function loadExerciseTree(): Promise<ExerciseTreeNode[]> {
    // Load curriculum files
    const domainsData: Record<string, Domain> = JSON.parse(
        fs.readFileSync(path.join(DATA_PATH, 'curriculum', 'domains.json'), 'utf-8')
    )
    const subdomainsData: Record<string, Subdomain> = JSON.parse(
        fs.readFileSync(path.join(DATA_PATH, 'curriculum', 'subdomains.json'), 'utf-8')
    )

    // Build lookup maps
    const domains = Object.values(domainsData)
    const subdomains = Object.values(subdomainsData)

    // Create domain to subdomains map
    const domainToSubdomains = new Map<number, Subdomain[]>()
    for (const subdomain of subdomains) {
        if (!domainToSubdomains.has(subdomain.domain)) {
            domainToSubdomains.set(subdomain.domain, [])
        }
        domainToSubdomains.get(subdomain.domain)!.push(subdomain)
    }

    // Load all questions from exam folders
    const questionsDir = path.join(DATA_PATH, 'questions')
    const examFolders = fs.readdirSync(questionsDir).filter(f =>
        fs.statSync(path.join(questionsDir, f)).isDirectory()
    )

    // Group questions by education_level + discipline
    const vakQuestions = new Map<string, QuestionData[]>()

    for (const folder of examFolders) {
        const folderPath = path.join(questionsDir, folder)
        const questionFiles = fs.readdirSync(folderPath).filter(f => f.startsWith('q') && f.endsWith('.json'))

        for (const qFile of questionFiles) {
            try {
                const questionData: QuestionData = JSON.parse(
                    fs.readFileSync(path.join(folderPath, qFile), 'utf-8')
                )

                const { education_level, discipline } = questionData.metadata.exam
                const vakKey = `${education_level}_${discipline}`

                if (!vakQuestions.has(vakKey)) {
                    vakQuestions.set(vakKey, [])
                }
                vakQuestions.get(vakKey)!.push(questionData)
            } catch (e) {
                console.error(`Error loading ${folder}/${qFile}:`, e)
            }
        }
    }

    // Build the tree structure
    const tree: ExerciseTreeNode[] = []

    for (const [vakKey, questions] of vakQuestions) {
        const [level, ...disciplineParts] = vakKey.split('_')
        const discipline = disciplineParts.join('_')

        // Get domains for this vak
        const edId = questions[0]?.metadata.curriculum.education_level_discipline_id
        const vakDomains = domains.filter(d => d.education_level_discipline === edId)

        // Create domain nodes
        const domainNodes: ExerciseTreeNode[] = []

        // Helper to create exercise node from question data
        const createExerciseNode = (q: QuestionData): ExerciseTreeNode => {
            const exercise: Exercise = {
                id: q.id,
                title: `Vraag ${extractQuestionNumber(q.id)} (${q.metadata.exam.year})`,
                educationLevel: q.metadata.exam.education_level,
                discipline: q.metadata.exam.discipline,
                difficulty: getDifficultyFromScore(q.question.max_score),
                content: q.question.text,
                contentContext: q.content_context,
                maxScore: q.question.max_score,
                examYear: q.metadata.exam.year,
                tijdvak: q.metadata.exam.tijdvak,
                questionNumber: extractQuestionNumber(q.id),
                domains: q.metadata.curriculum.domains,
                subdomains: q.metadata.curriculum.subdomains,
                solution: q.solution,
                bijlages: q.bijlages,
            }
            return {
                id: q.id,
                label: exercise.title,
                type: 'exercise' as const,
                exercise,
            }
        }

        // Track which questions have been placed
        const placedQuestionIds = new Set<string>()

        for (const domain of vakDomains) {
            const domainSubdomains = domainToSubdomains.get(domain.id) || []
            const domainChildren: ExerciseTreeNode[] = []

            // 1. Create subdomain nodes for questions WITH subdomain links
            for (const subdomain of domainSubdomains) {
                const subdomainQuestions = questions.filter(q =>
                    q.metadata.curriculum.subdomains.some(sd => sd.id === subdomain.id)
                )

                if (subdomainQuestions.length === 0) continue

                const exerciseNodes = subdomainQuestions.map(q => {
                    placedQuestionIds.add(q.id)
                    return createExerciseNode(q)
                })

                domainChildren.push({
                    id: `subdomain-${subdomain.id}`,
                    label: `${subdomain.prefix_code}: ${subdomain.name}`,
                    type: 'subdomein',
                    children: exerciseNodes,
                })
            }

            // 2. Find questions that have THIS domain but NO subdomain links
            const domainOnlyQuestions = questions.filter(q =>
                q.metadata.curriculum.domains.some(d => d.id === domain.id) &&
                q.metadata.curriculum.subdomains.length === 0 &&
                !placedQuestionIds.has(q.id)
            )

            if (domainOnlyQuestions.length > 0) {
                const exerciseNodes = domainOnlyQuestions.map(q => {
                    placedQuestionIds.add(q.id)
                    return createExerciseNode(q)
                })

                // Add as "Overige vragen" subdomain under this domain
                domainChildren.push({
                    id: `domain-${domain.id}-other`,
                    label: 'Overige vragen',
                    type: 'subdomein',
                    children: exerciseNodes,
                })
            }

            if (domainChildren.length === 0) continue

            domainNodes.push({
                id: `domain-${domain.id}`,
                label: `${domain.prefix_code}: ${domain.name}`,
                type: 'domein',
                children: domainChildren,
            })
        }

        // 3. Only truly unclassified questions (no domain AND no subdomain links)
        const orphanQuestions = questions.filter(q =>
            !placedQuestionIds.has(q.id) &&
            q.metadata.curriculum.domains.length === 0 &&
            q.metadata.curriculum.subdomains.length === 0
        )

        if (orphanQuestions.length > 0) {
            const orphanNodes = orphanQuestions.map(createExerciseNode)

            domainNodes.push({
                id: `orphan-${vakKey}`,
                label: 'Niet-geclassificeerd',
                type: 'domein',
                children: orphanNodes,
            })
        }

        if (domainNodes.length === 0) continue

        tree.push({
            id: vakKey,
            label: getDisplayName(level, discipline),
            type: 'vak',
            children: domainNodes,
        })
    }

    // Sort tree: by education level (VWO first, then HAVO, then VMBO), then by discipline name
    const levelOrder = ['vwo', 'havo', 'vmbo_gl', 'vmbo_tl', 'vmbo_kb', 'vmbo_bb']
    tree.sort((a, b) => {
        const aLevel = a.id.split('_')[0]
        const bLevel = b.id.split('_')[0]
        const aLevelIdx = levelOrder.indexOf(aLevel)
        const bLevelIdx = levelOrder.indexOf(bLevel)
        if (aLevelIdx !== bLevelIdx) return aLevelIdx - bLevelIdx
        return a.label.localeCompare(b.label, 'nl')
    })

    return tree
}
