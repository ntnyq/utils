/**
 * The last zero-based index in the English alphabet, corresponding to Z.
 */
const MAX_LETTER_INDEX = 25

/**
 * The Unicode code point of uppercase A, used as the uppercase letter offset.
 */
const UPPERCASE_A_CODE_POINT = 65

/**
 * The Unicode code point of lowercase a, used as the lowercase letter offset.
 */
const LOWERCASE_A_CODE_POINT = 97

/**
 * Gets an English letter by its zero-based index, from 0 (A) to 25 (Z).
 * @param index - An integer between 0 and 25, inclusive.
 * @param isLowerCase - Whether to return a lowercase letter. Defaults to false.
 * @returns The corresponding uppercase or lowercase English letter.
 * @throws {RangeError} If the index is not an integer between 0 and 25.
 *
 * @example
 *
 * ```typescript
 * import { getLetterByIndex } from '@ntnyq/utils'
 *
 * getLetterByIndex(0) // => 'A'
 * getLetterByIndex(25) // => 'Z'
 * getLetterByIndex(0, true) // => 'a'
 * ```
 */
export function getLetterByIndex(index: number, isLowerCase = false): string {
  if (!Number.isInteger(index) || index < 0 || index > MAX_LETTER_INDEX) {
    throw new RangeError('Letter index must be an integer between 0 and 25')
  }

  return String.fromCodePoint(
    (isLowerCase ? LOWERCASE_A_CODE_POINT : UPPERCASE_A_CODE_POINT) + index,
  )
}
