/**
 * Type guard for any key, `k`
 * marks `k` as a key of `T` if `k` is a key of `T`
 *
 * @param obj - object to query for key
 * @param k - key to check for
 * @returns true if `k` is a key of `T`
 * @example
 *
 * ```typescript
 * import { isKeyOf } from '@ntnyq/utils'
 *
 * const object = { a: 1, b: 2 }
 * const key = 'a' as string
 *
 * if (isKeyOf(object, key)) {
 *   console.log(object[key]) // => 1
 * }
 * ```
 *
 */
export function isKeyOf<T extends object>(
  obj: T,
  k: PropertyKey,
): k is keyof T {
  return k in obj
}
