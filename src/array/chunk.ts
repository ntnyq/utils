/**
 * Splits an array into smaller chunks of a given size.
 * @param array - The array to split
 * @param size - The size of each chunk
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 * @example
 *
 * ```typescript
 * import { chunk } from '@ntnyq/utils'
 *
 * const result = chunk([1, 2, 3, 4], 2)
 * console.log(result) // => [[1, 2], [3, 4]]
 * ```
 *
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('Chunk size must be a positive integer')
  }

  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
