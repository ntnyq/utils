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
