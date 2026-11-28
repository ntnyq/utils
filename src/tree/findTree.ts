import type { TreeTraversalContext, TreeTraversalOptions } from './types'
import { walkTree } from './walkTree'

export type TreePredicate<Node> = (
  context: TreeTraversalContext<Node>,
) => boolean

/**
 * Finds the first tree node matching a predicate.
 *
 * @param roots - Root nodes.
 * @param predicate - Match predicate.
 * @param options - Traversal options.
 * @returns The matched node or undefined.
 *
 * @example
 *
 * ```typescript
 * import { findTreeNode } from '@ntnyq/utils'
 *
 * const tree = [{ id: 1, children: [{ id: 2 }] }]
 * const match = findTreeNode(tree, ({ node }) => node.id === 2)
 * console.log(match) // => { id: 2 }
 * ```
 */
export function findTreeNode<
  Node extends object,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  predicate: TreePredicate<Node>,
  options: TreeTraversalOptions<Node, ChildrenKey> = {},
): Node | undefined {
  let matchedNode: Node | undefined

  walkTree<Node, ChildrenKey>(
    roots,
    context => {
      if (!predicate(context)) {
        return 'continue'
      }
      matchedNode = context.node
      return 'stop'
    },
    options,
  )

  return matchedNode
}
