/**
 * Defines an own child-array property on a tree node.
 *
 * The property remains safe for special keys such as `__proto__` and is
 * configurable, enumerable, and writable.
 *
 * @param node - Tree node receiving the child property.
 * @param childrenKey - Property used for child nodes.
 * @param children - Child array assigned to the node.
 *
 * @example
 *
 * ```typescript
 * import { defineTreeChildren } from './defineTreeChildren'
 *
 * const node = { id: 1 }
 * defineTreeChildren(node, 'children', [{ id: 2 }])
 * console.log(node) // => { id: 1, children: [{ id: 2 }] }
 * ```
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
