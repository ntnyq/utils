import {
  createTreeTraversalContext,
  getTreeChildren,
  resolveChildrenKey,
} from './internals'
import type { TreeTraversalContext, TreeTraversalOptions } from './types'

export interface MapTreeContext<
  Node,
  Mapped,
> extends TreeTraversalContext<Node> {
  children: Mapped[]
}

export type TreeMapper<Node, Mapped> = (
  context: MapTreeContext<Node, Mapped>,
) => Mapped

/**
 * Maps a tree to an arbitrary output type without mutating source nodes.
 *
 * The mapper receives already-mapped child nodes, allowing it to choose the
 * output children property and shape.
 *
 * @param roots - Root nodes.
 * @param mapper - Maps a node and its mapped children.
 * @param options - Traversal options.
 * @returns Mapped root nodes.
 *
 * @example
 *
 * ```typescript
 * import { mapTree } from '@ntnyq/utils'
 *
 * const mapped = mapTree(tree, ({ node, children }) => ({
 *   value: node.id,
 *   children,
 * }))
 * ```
 */
export function mapTree<
  Node extends object,
  Mapped,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  mapper: TreeMapper<Node, Mapped>,
  options: TreeTraversalOptions<Node, ChildrenKey> = {},
): Mapped[] {
  const childrenKey = resolveChildrenKey(options.childrenKey)
  const { onCycle = 'throw' } = options
  const ancestors = new Set<Node>()

  function mapNodes(
    nodes: readonly Node[],
    parent: Node | null,
    depth: number,
    parentPath: readonly Node[],
  ): Mapped[] {
    const mappedNodes: Mapped[] = []

    for (const [index, node] of nodes.entries()) {
      if (ancestors.has(node)) {
        if (onCycle === 'throw') {
          throw new TypeError('Tree contains a circular reference')
        }
      } else {
        const path = [...parentPath, node]
        ancestors.add(node)
        try {
          const children = mapNodes(
            getTreeChildren(node, childrenKey),
            node,
            depth + 1,
            path,
          )

          mappedNodes.push(
            mapper({
              ...createTreeTraversalContext(node, parent, depth, index, path),
              children,
            }),
          )
        } finally {
          ancestors.delete(node)
        }
      }
    }

    return mappedNodes
  }

  return mapNodes(roots, null, 0, [])
}
