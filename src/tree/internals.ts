/**
 * Gets array-valued children from a tree node.
 *
 * Non-array child properties are treated as empty child collections.
 *
 * @param node - Tree node to inspect.
 * @param childrenKey - Property containing child nodes.
 * @returns Child nodes or an empty array.
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
 */
export function resolveChildrenKey<ChildrenKey extends PropertyKey>(
  childrenKey: ChildrenKey | undefined,
): ChildrenKey {
  return childrenKey ?? ('children' as ChildrenKey)
}
