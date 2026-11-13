/**
 * Check if values of two arrays are equal. Sparse slots are read as undefined.
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
export function isArrayEqual(
  array1: readonly unknown[],
  array2: readonly unknown[],
): boolean {
  if (array1.length !== array2.length) {
    return false
  }

  for (let index = 0; index < array1.length; index++) {
    if (array1[index] !== array2[index]) {
      return false
    }
  }
  return true
}
