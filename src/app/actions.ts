'use server'

import { loadExerciseTree, type ExerciseTreeNode } from '@/lib/data-loader'

// Cache the loaded data in memory
let cachedTree: ExerciseTreeNode[] | null = null

export async function getExerciseTree(): Promise<ExerciseTreeNode[]> {
    if (cachedTree) {
        return cachedTree
    }

    cachedTree = await loadExerciseTree()
    return cachedTree
}

// Clear cache (useful for development)
export async function clearTreeCache(): Promise<void> {
    cachedTree = null
}
