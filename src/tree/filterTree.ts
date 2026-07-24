import type { TreeTraversalContext } from './types'

export interface FilterTreeOptions<T extends object, Key extends keyof T> {
  /**
   * Property containing child nodes.
   *
   * @default `children`
   */
  childrenKey?: Key
}

/**
 * Filters a tree without mutating its nodes.
 *
 * A node is retained when it matches the predicate or has a retained
 * descendant. A matching node does not automatically retain unmatched
 * descendants.
 *
 * @param roots - Source tree roots.
 * @param predicate - Determines which nodes match.
 * @param options - Child-key options.
 * @returns A cloned tree containing matches and their ancestor paths.
 *
 * @example
 *
 * ```typescript
 * import { filterTree } from '@ntnyq/utils'
 *
 * const tree = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }]
 * const result = filterTree(tree, ({ node }) => node.id === 2)
 * console.log(result[0]?.children) // => [{ id: 2 }]
 * ```
 */
export function filterTree<T extends object>(
  roots: readonly T[],
  predicate: (context: TreeTraversalContext<T>) => boolean,
  options: FilterTreeOptions<T, keyof T> = {},
): T[] {
  const { childrenKey = 'children' as keyof T } = options
  const activeNodes = new Set<T>()

  const visit = (
    nodes: readonly T[],
    parent: T | null,
    depth: number,
    parentPath: T[],
  ): T[] => {
    const results: T[] = []

    nodes.forEach((node, index) => {
      if (activeNodes.has(node)) {
        throw new RangeError('Tree contains a circular child reference')
      }

      activeNodes.add(node)
      try {
        const path = [...parentPath, node]
        const isMatch = predicate({ depth, index, node, parent, path })
        const sourceChildren = Reflect.get(node, childrenKey)
        const filteredChildren = Array.isArray(sourceChildren)
          ? visit(sourceChildren as T[], node, depth + 1, path)
          : []

        if (!isMatch && filteredChildren.length === 0) {
          return
        }

        const clonedNode = { ...node }
        if (Array.isArray(sourceChildren)) {
          Reflect.set(clonedNode, childrenKey, filteredChildren)
        }
        results.push(clonedNode)
      } finally {
        activeNodes.delete(node)
      }
    })

    return results
  }

  return visit(roots, null, 0, [])
}
