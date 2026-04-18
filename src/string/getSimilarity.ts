/**
 * @copyright {@link https://github.com/stephenjjbrown/string-similarity-js}
 */

export interface GetStringSimilarityOptions {
  /**
   * The length of the slice to compare.
   * @default 2
   */
  sliceLength?: number
  /**
   * Whether to ignore case when comparing strings.
   * @default false
   */
  caseSensitive?: boolean
}

/**
 * Calculates the similarity score between two strings.
 * @param str1 - The first string to compare.
 * @param str2 - The second string to compare.
 * @param options - Options for controlling the comparison behavior.
 * @returns A similarity score between 0 and 1.
 *
 * @example
 *
 * ```typescript
 * import { getStringSimilarity } from '@ntnyq/utils'
 *
 * const result = getStringSimilarity('hello', 'hallo')
 * console.log(result > 0.5) // => true
 * ```
 */
export function getStringSimilarity(
  str1: string,
  str2: string,
  options: GetStringSimilarityOptions = {},
): number {
  const { sliceLength = 2, caseSensitive = false } = options

  if (!caseSensitive) {
    str1 = str1.toLowerCase()
    str2 = str2.toLowerCase()
  }

  if (str1.length < sliceLength || str2.length < sliceLength) {
    return 0
  }

  const map = new Map<string, number>()

  for (let i = 0; i < str1.length - (sliceLength - 1); i++) {
    const subStr1 = str1.slice(i, i + sliceLength)
    map.set(subStr1, (map.get(subStr1) || 0) + 1)
  }

  let match = 0

  for (let i = 0; i < str2.length - (sliceLength - 1); i++) {
    const subStr2 = str2.slice(i, i + sliceLength)
    const count = map.get(subStr2) || 0
    if (count > 0) {
      match++
      map.set(subStr2, count - 1)
    }
  }

  return (match * 2) / (str1.length + str2.length - (sliceLength - 1) * 2)
}
