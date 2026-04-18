/**
 * Removes the specified keys from an object in place.
 * @param object - The source object to mutate.
 * @param keys - The keys to remove from the object.
 * @returns The same object instance with the selected keys removed.
 *
 * @example
 *
 * ```typescript
 * import { omit } from '@ntnyq/utils'
 *
 * const result = omit({ a: 1, b: 2, c: 3 }, 'b')
 * console.log(result) // => { a: 1, c: 3 }
 * ```
 */
export function omit<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  keys.forEach(key => delete object[key])
  return object
}
