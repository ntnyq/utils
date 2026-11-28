import { traverseTree } from './traverseTree'
import type { TreeTraversalContext, TreeTraversalOptions } from './types'

export type WalkTreeControl = 'continue' | 'skip' | 'stop' | undefined

export type WalkTreeVisitor<Node> = (
  context: TreeTraversalContext<Node>,
) => WalkTreeControl

export interface WalkTreeResult<Node> {
  isStopped: boolean
  stoppedNode: Node | undefined
  visitedCount: number
}

/**
 * Walks a tree in depth-first preorder.
 *
 * A visitor may return `skip` to skip the current node's descendants or
 * `stop` to stop the entire traversal.
 *
 * @param roots - Root nodes.
 * @param visitor - Called once for every visited node.
 * @param options - Traversal options.
 * @returns Traversal status and visit count.
 *
 * @example
 *
 * ```typescript
 * import { walkTree } from '@ntnyq/utils'
 *
 * const tree = [{ id: 1, children: [{ id: 2 }] }]
 * walkTree(tree, ({ node }) => {
 *   console.log(node.id) // logs 1, then 2
 * })
 * ```
 */
export function walkTree<
  Node extends object,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  visitor: WalkTreeVisitor<Node>,
  options: TreeTraversalOptions<Node, ChildrenKey> = {},
): WalkTreeResult<Node> {
  return traverseTree(
    roots,
    visitor,
    options,
    () => new TypeError('Tree contains a circular reference'),
  )
}
