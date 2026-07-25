/**
 * Defines an own child-array property on a tree node.
 *
 * The property remains safe for special keys such as `__proto__` and is
 * configurable, enumerable, and writable.
 *
 * @param node - Tree node receiving the child property.
 * @param childrenKey - Property used for child nodes.
 * @param children - Child array assigned to the node.
 */
export function defineTreeChildren<T extends object>(
  node: T,
  childrenKey: PropertyKey,
  children: unknown[],
): void {
  Object.defineProperty(node, childrenKey, {
    configurable: true,
    enumerable: true,
    value: children,
    writable: true,
  })
}
