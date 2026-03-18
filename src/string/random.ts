import { randomNumber } from '../number'

/**
 * randome a string useing given chars
 *
 * @param length - string length
 * @param chars - string chars
 * @returns random string
 */
export function randomString(
  length = 16,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string {
  const result: string[] = []
  for (let i = length; i > 0; --i) {
    const matchedChar = chars[randomNumber(chars.length)]
    if (matchedChar) {
      result.push(matchedChar)
    }
  }
  return result.join('')
}
