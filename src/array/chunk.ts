/**
 * Splits an array into smaller chunks of a given size.
 * @param array The array to split
 * @param size The size of each chunk
 * @returns An array of arrays, where each sub-array has `size` elements from the original array.
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
