import { cloneDeepInternal } from './cloneDeepInternal'

/**
 * Deeply clones a value, preserving built-in collection and buffer types,
 * property descriptors, prototypes, symbol keys, and circular references.
 * Functions and unsupported opaque built-ins are retained by identity.
 * @param value - The value to clone.
 * @param hash - Objects already cloned during this operation.
 * @returns A deep clone of the input value.
 */
export function cloneDeep<T>(
  value: T,
  hash: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
): T {
  return cloneDeepInternal(value, hash)
}
