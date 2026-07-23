import { randomInteger } from '../number'

/**
 * Generates a random string using the provided characters.
 *
 * @param length - Non-negative integer output length.
 * @param chars - Characters used to generate the output.
 * @returns A random string.
 * @throws {RangeError} When length is invalid or chars is empty for non-empty output.
 * @example
 *
 * ```typescript
 * import { randomString } from '@ntnyq/utils'
 *
 * const result = randomString(8)
 * console.log(result.length) // => 8
 * ```
 *
 */
export function randomString(
  length = 16,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('Random string length must be a non-negative integer')
  }
  if (length > 0 && chars.length === 0) {
    throw new RangeError('Random string characters must not be empty')
  }

  const result: string[] = []
  for (let i = length; i > 0; --i) {
    const matchedChar = chars[randomInteger(chars.length)]
    if (matchedChar) {
      result.push(matchedChar)
    }
  }
  return result.join('')
}
