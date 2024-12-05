/**
 * Type guard for any key, `k`
 * marks `k` as a key of `T` if `k` is a key of `T`
 *
 * @param obj - object to query for key
 * @param k - key to check for
 * @returns true if `k` is a key of `T`
 */
export function isKeyOf<T extends object>(obj: T, k: keyof T): k is keyof T {
  return k in obj
}
