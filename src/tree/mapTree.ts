import { foldTree } from './traverseTree'
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

function createMapTreeContext<Node, Mapped>(
  context: TreeTraversalContext<Node>,
  children: Mapped[],
): MapTreeContext<Node, Mapped> {
  return {
    children,
    depth: context.depth,
    index: context.index,
    node: context.node,
    parent: context.parent,
    get path(): Node[] {
      return context.path
    },
    set path(nextPath: Node[]) {
      context.path = nextPath
    },
  }
}

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
  return foldTree(
    roots,
    {
      leave: (context, children) =>
        mapper(createMapTreeContext(context, children)),
    },
    undefined,
    options,
    () => new TypeError('Tree contains a circular reference'),
  )
}
