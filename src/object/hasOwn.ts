/**
 * Checks whether a non-nullish value has an own property with the given key.
 * @param object - the object to check
 * @param key - the key to check
 * @returns True for an own property, or false for nullish values and missing keys.
 * @example
 *
 * ```typescript
 * import { hasOwn } from '@ntnyq/utils'
 *
 * const result = hasOwn({ a: 1 }, 'a')
 * console.log(result) // => true
 * ```
 *
 */
export function hasOwn<T>(object: T, key: PropertyKey): boolean {
  if (object === null || object === undefined) {
    return false
  }
  // oxlint-disable-next-line prefer-object-has-own
  return Object.prototype.hasOwnProperty.call(object, key)
}
