import { defineTreeChildren } from './defineTreeChildren'
import type { TreePredicate } from './findTree'
import { foldTree, TREE_FOLD_SKIP } from './traverseTree'
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

interface FilterTreeState {
  includeAll: boolean
  isMatch: boolean
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
  const { childrenKey = 'children' as ChildrenKey } = options
  const { includeDescendants = false, onCycle = 'throw' } = options
  const rootState: FilterTreeState = {
    includeAll: false,
    isMatch: false,
  }

  return foldTree(
    roots,
    {
      enter: (context, parentState) => {
        const isMatch = parentState.includeAll || predicate(context)
        return {
          includeAll: parentState.includeAll || (isMatch && includeDescendants),
          isMatch,
        }
      },
      leave: (context, filteredChildren, state) => {
        if (!state.isMatch && filteredChildren.length === 0) {
          return TREE_FOLD_SKIP
        }

        const sourceChildren = Reflect.get(context.node, childrenKey)
        const clonedNode = { ...context.node }
        if (Array.isArray(sourceChildren)) {
          defineTreeChildren(clonedNode, childrenKey, filteredChildren)
        }
        return clonedNode
      },
    },
    rootState,
    {
      childrenKey,
      onCycle,
    },
    () => new RangeError('Tree contains a circular child reference'),
  )
}
