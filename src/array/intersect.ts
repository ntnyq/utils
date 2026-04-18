/**
 * Gets the intersection of two arrays.
 * @param a - The first array.
 * @param b - The second array.
 * @returns A new array containing items present in both arrays.
 *
 * @example
 *
 * ```typescript
 * import { intersect } from '@ntnyq/utils'
 *
 * const result = intersect([1, 2, 3], [2, 3, 4])
 * console.log(result) // => [2, 3]
 * ```
 */
export function intersect<T>(a: T[], b: T[]): T[] {
  return a.filter(item => b.includes(item))
}
