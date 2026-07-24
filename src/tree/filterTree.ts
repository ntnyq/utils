import { defineTreeChildren } from './defineTreeChildren'
import type { TreePredicate } from './findTree'
import { createTreeTraversalContext, resolveChildrenKey } from './internals'
import type { TreeTraversalOptions } from './types'

export interface FilterTreeOptions<
  Node,
  ChildrenKey extends keyof Node = keyof Node,
> extends TreeTraversalOptions<Node, ChildrenKey> {
  /**
   * Keeps every descendant after a node matches.
   *
   * When false, each descendant must match or contain a match.
   *
   * @default false
   */
  includeDescendants?: boolean
}

/**
 * Filters a tree without mutating its nodes.
 *
 * A node is retained when it matches the predicate or has a retained
 * descendant. A matching node retains all descendants only when
 * `includeDescendants` is enabled.
 *
 * @param roots - Source tree roots.
 * @param predicate - Determines which nodes match.
 * @param options - Child-key, cycle, and descendant options.
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
export function filterTree<
  Node extends object,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  predicate: TreePredicate<Node>,
  options: FilterTreeOptions<Node, ChildrenKey> = {},
): Node[] {
  const childrenKey = resolveChildrenKey(options.childrenKey)
  const { includeDescendants = false, onCycle = 'throw' } = options
  const activeNodes = new Set<Node>()

  function visit(
    nodes: readonly Node[],
    parent: Node | null,
    depth: number,
    parentPath: readonly Node[],
    includeAll: boolean,
  ): Node[] {
    const results: Node[] = []

    nodes.forEach((node, index) => {
      if (activeNodes.has(node)) {
        if (onCycle === 'throw') {
          throw new RangeError('Tree contains a circular child reference')
        }
        return
      }

      activeNodes.add(node)
      try {
        const path = [...parentPath, node]
        const isMatch =
          includeAll ||
          predicate(
            createTreeTraversalContext(node, parent, depth, index, path),
          )
        const sourceChildren = Reflect.get(node, childrenKey)
        const filteredChildren = Array.isArray(sourceChildren)
          ? visit(
              sourceChildren as Node[],
              node,
              depth + 1,
              path,
              includeAll || (isMatch && includeDescendants),
            )
          : []

        if (!isMatch && filteredChildren.length === 0) {
          return
        }

        const clonedNode = { ...node }
        if (Array.isArray(sourceChildren)) {
          defineTreeChildren(clonedNode, childrenKey, filteredChildren)
        }
        results.push(clonedNode)
      } finally {
        activeNodes.delete(node)
      }
    })

    return results
  }

  return visit(roots, null, 0, [], false)
}
