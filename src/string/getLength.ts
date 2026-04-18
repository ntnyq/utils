let segmenter: Intl.Segmenter | undefined

function isASCII(value: string): boolean {
  return /^[\u0020-\u007F]*$/u.test(value)
}

/**
 * Counts graphemes in a given string
 * @param value - A string to count graphemes.
 * @returns The number of graphemes in `value`.
 * @example
 *
 * ```typescript
 * import { getStringLength } from '@ntnyq/utils'
 *
 * const result = getStringLength('👋🌍')
 * console.log(result) // => 2
 * ```
 *
 */
export function getStringLength(value: string): number {
  if (isASCII(value)) {
    return value.length
  }

  segmenter ??= new Intl.Segmenter()

  return [...segmenter.segment(value)].length
}
