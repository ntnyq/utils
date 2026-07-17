import { randomInteger } from '../number'

/**
 * Fisher–Yates shuffle
 *
 * @param array - array to shuffle
 * @returns shuffled array
 * @example
 *
 * ```typescript
 * import { shuffle } from '@ntnyq/utils'
 *
 * const result = shuffle([1, 2, 3, 4])
 * console.log(result) // => shuffled array
 * ```
 *
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInteger(0, i, { includeMax: true })
    // @ts-expect-error make TS happy
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
