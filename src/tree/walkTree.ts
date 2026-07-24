import {
  createTreeTraversalContext,
  getTreeChildren,
  resolveChildrenKey,
} from './internals'
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
 * walkTree(tree, ({ node }) => {
 *   console.log(node)
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
  const childrenKey = resolveChildrenKey(options.childrenKey)
  const { onCycle = 'throw' } = options
  const ancestors = new Set<Node>()
  let isStopped = false
  let stoppedNode: Node | undefined
  let visitedCount = 0

  function visitNode(
    node: Node,
    index: number,
    parent: Node | null,
    depth: number,
    parentPath: readonly Node[],
  ): void {
    if (ancestors.has(node)) {
      if (onCycle === 'throw') {
        throw new TypeError('Tree contains a circular reference')
      }
      return
    }

    const path = [...parentPath, node]
    ancestors.add(node)
    visitedCount++

    try {
      const control = visitor(
        createTreeTraversalContext(node, parent, depth, index, path),
      )
      if (control === 'stop') {
        isStopped = true
        stoppedNode = node
        return
      }

      if (control !== 'skip') {
        visit(getTreeChildren(node, childrenKey), node, depth + 1, path)
      }
    } finally {
      ancestors.delete(node)
    }
  }

  function visit(
    nodes: readonly Node[],
    parent: Node | null,
    depth: number,
    parentPath: readonly Node[],
  ): void {
    for (const [index, node] of nodes.entries()) {
      visitNode(node, index, parent, depth, parentPath)
      if (isStopped) {
        return
      }
    }
  }

  visit(roots, null, 0, [])

  return {
    isStopped,
    stoppedNode,
    visitedCount,
  }
}
