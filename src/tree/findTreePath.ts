import { traverseTree } from './traverseTree'
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
  let matchedPath: T[] | undefined

  traverseTree(
    roots,
    (context, resolvePath) => {
      if (!predicate(context)) {
        return 'continue'
      }
      matchedPath = resolvePath()
      return 'stop'
    },
    options,
    () => new RangeError('Tree contains a circular child reference'),
  )

  return matchedPath
}
