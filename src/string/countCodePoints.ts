/**
 * Counts Unicode code points using JavaScript string iteration.
 * Whitespace is preserved and no Unicode normalization is applied.
 * Combining marks and joined emoji are counted separately, while each
 * unpaired UTF-16 surrogate counts as one.
 *
 * @param value - The string to count code points in.
 * @returns The number of code points in `value`.
 * @example
 *
 * ```typescript
 * import { countCodePoints } from '@ntnyq/utils'
 *
 * countCodePoints('') // => 0
 * countCodePoints('你好😀') // => 3
 * countCodePoints('e\u0301') // => 2
 * countCodePoints('🇨🇳') // => 2
 * countCodePoints('👨‍👩‍👧‍👦') // => 7
 * ```
 */
export function countCodePoints(value: string): number {
  return [...value].length
}
