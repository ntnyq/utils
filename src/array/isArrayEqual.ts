/**
 * Check if values of two arrays are equal
 * @param array1 - array 1
 * @param array2 - array 2
 * @returns `true` if equal
 * @example
 *
 * ```typescript
 * import { isArrayEqual } from '@ntnyq/utils'
 *
 * const result = isArrayEqual([1, 2], [1, 2])
 * console.log(result) // => true
 * ```
 *
 */
export function isArrayEqual(array1: unknown[], array2: unknown[]): boolean {
  if (array1.length !== array2.length) {
    return false
  }

  return array1.every((item, idx) => item === array2[idx])
}
