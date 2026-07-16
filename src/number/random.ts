export interface RandomNumberOptions {
  /**
   * include max value
   *
   * @default false
   */
  includeMax?: boolean
}

/**
 * random an integer by given range
 *
 * @param min - min value
 * @param max - max value
 * @returns random integer in range
 * @example
 *
 * ```typescript
 * import { randomNumber } from '@ntnyq/utils'
 *
 * const result = randomNumber(10)
 * console.log(result) // => a number between 0 and 9
 * ```
 *
 */
export function randomNumber(
  min: number,
  max?: number,
  options: RandomNumberOptions = {},
): number {
  if (max === undefined) {
    max = min
    min = 0
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('Random number bounds must be finite')
  }

  if (min > max) {
    ;[min, max] = [max, min]
  }

  if (min === max && Number.isInteger(min)) {
    return min
  }

  const lower = Math.ceil(min)
  const upper = options.includeMax ? Math.floor(max) : Math.ceil(max) - 1

  if (lower > upper) {
    throw new RangeError('Random number range contains no integers')
  }

  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}
