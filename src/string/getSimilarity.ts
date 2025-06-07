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
