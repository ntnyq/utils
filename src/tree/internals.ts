/**
 * Gets array-valued children from a tree node.
 *
 * Non-array child properties are treated as empty child collections.
 *
 * @param node - Tree node to inspect.
 * @param childrenKey - Property containing child nodes.
 * @returns Child nodes or an empty array.
 *
 * @example
 *
 * ```typescript
 * import { getTreeChildren } from './internals'
 *
 * interface Node {
 *   id: number
 *   children?: Node[]
 * }
 *
 * const node: Node = { id: 1, children: [{ id: 2 }] }
 * console.log(getTreeChildren(node, 'children')) // => [{ id: 2 }]
 * ```
 */
export function getTreeChildren<
  Node extends object,
  ChildrenKey extends keyof Node,
>(node: Node, childrenKey: ChildrenKey): readonly Node[] {
  const children = node[childrenKey] as unknown
  return Array.isArray(children) ? (children as readonly Node[]) : []
}

/**
 * Resolves the property used to access child nodes.
 *
 * @param childrenKey - Explicit child property.
 * @returns The explicit property or `children` by default.
 *
 * @example
 *
 * ```typescript
 * import { resolveChildrenKey } from './internals'
 *
 * console.log(resolveChildrenKey(undefined)) // => 'children'
 * console.log(resolveChildrenKey('items')) // => 'items'
 * ```
 */
export function resolveChildrenKey<ChildrenKey extends PropertyKey>(
  childrenKey: ChildrenKey | undefined,
): ChildrenKey {
  return childrenKey ?? ('children' as ChildrenKey)
}
