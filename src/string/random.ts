import { randomNumber } from '../number'

/**
 * randome a string useing given chars
 *
 * @param length - string length
 * @param chars - string chars
 * @returns random string
 */
export function randomString(
  length: number = 16,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) {
  const result: string[] = []
  for (let i = length; i > 0; --i) {
    result.push(chars[randomNumber(chars.length)])
  }
  return result.join('')
}
