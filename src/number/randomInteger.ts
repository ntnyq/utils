export interface RandomIntegerOptions {
  /**
   * include max value
   *
   * @default false
   */
  includeMax?: boolean
}

/**
 * Generate a random integer within the given range.
 * Integer bounds and the number of possible results must fit safe precision.
 *
 * @param min - min value
 * @param max - max value
 * @returns A random integer within the range.
 * @example
 *
 * ```typescript
 * import { randomInteger } from '@ntnyq/utils'
 *
 * const result = randomInteger(10)
 * console.log(result) // => a number between 0 and 9
 * ```
 *
 */
export function randomInteger(
  min: number,
  max?: number,
  options: RandomIntegerOptions = {},
): number {
  if (max === undefined) {
    max = min
    min = 0
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('Random integer bounds must be finite')
  }

  if (min > max) {
    ;[min, max] = [max, min]
  }

  if (min === max && Number.isSafeInteger(min)) {
    return min
  }

  const lower = Math.ceil(min)
  const upper = options.includeMax ? Math.floor(max) : Math.ceil(max) - 1

  if (lower > upper) {
    throw new RangeError('Random integer range contains no integers')
  }

  const size = upper - lower + 1
  if (
    !Number.isSafeInteger(lower) ||
    !Number.isSafeInteger(upper) ||
    !Number.isSafeInteger(size)
  ) {
    throw new RangeError(
      'Random integer bounds and range size must be safe integers',
    )
  }

  return Math.floor(Math.random() * size) + lower
}
