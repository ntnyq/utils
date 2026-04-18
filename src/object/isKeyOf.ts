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
 * const result = isKeyOf({ a: 1, b: 2 }, 'a')
 * console.log(result) // => true
 * ```
 *
 */
export function isKeyOf<T extends object>(obj: T, k: keyof T): k is keyof T {
  return k in obj
}
