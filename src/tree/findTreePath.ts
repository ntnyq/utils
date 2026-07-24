import type { TreeTraversalContext, TreeTraversalOptions } from './types'

export type FindTreePathOptions<
  T extends object,
  Key extends keyof T,
> = TreeTraversalOptions<T, Key>

/**
 * Finds the first depth-first matching node and returns its ancestor path.
 *
 * Returned path entries are the original node references.
 *
 * @param roots - Source tree roots.
 * @param predicate - Determines the target node.
 * @param options - Child-key options.
 * @returns Root-to-node path, or undefined when no node matches.
 *
 * @example
 *
 * ```typescript
 * import { findTreePath } from '@ntnyq/utils'
 *
 * const tree = [{ id: 1, children: [{ id: 2 }] }]
 * const path = findTreePath(tree, ({ node }) => node.id === 2)
 * console.log(path?.map(node => node.id)) // => [1, 2]
 * ```
 */
export function findTreePath<T extends object>(
  roots: readonly T[],
  predicate: (context: TreeTraversalContext<T>) => boolean,
  options: FindTreePathOptions<T, keyof T> = {},
): T[] | undefined {
  const { childrenKey = 'children' as keyof T, onCycle = 'throw' } = options
  const activeNodes = new Set<T>()

  function visitNode(
    node: T,
    index: number,
    parent: T | null,
    depth: number,
    parentPath: T[],
  ): T[] | undefined {
    if (activeNodes.has(node)) {
      if (onCycle === 'throw') {
        throw new RangeError('Tree contains a circular child reference')
      }
      return
    }

    activeNodes.add(node)
    try {
      const path = [...parentPath, node]
      if (
        predicate({
          depth,
          index,
          node,
          parent,
          path: [...path],
        })
      ) {
        return path
      }

      const children = Reflect.get(node, childrenKey)
      let childPath: T[] | undefined
      if (Array.isArray(children)) {
        childPath = visit(children as T[], node, depth + 1, path)
      }
      return childPath
    } finally {
      activeNodes.delete(node)
    }
  }

  function visit(
    nodes: readonly T[],
    parent: T | null,
    depth: number,
    parentPath: T[],
  ): T[] | undefined {
    let matchedPath: T[] | undefined
    for (const [index, node] of nodes.entries()) {
      matchedPath = visitNode(node, index, parent, depth, parentPath)
      if (matchedPath) {
        break
      }
    }

    return matchedPath
  }

  return visit(roots, null, 0, [])
}
