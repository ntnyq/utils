import { randomNumber } from '../number'

/**
 * Fisher–Yates shuffle
 *
 * @param array - array to shuffle
 * @returns shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomNumber(0, i, { includeMax: true })
    // @ts-expect-error make TS happy
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
