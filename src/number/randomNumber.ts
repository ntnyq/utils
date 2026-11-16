/**
 * Generate a random number within the given range.
 * The lower bound is inclusive and the upper bound is normally exclusive,
 * but floating-point rounding can produce the upper bound.
 * Equal bounds return that value. Reversed bounds are swapped.
 *
 * @param min - Lower bound, or upper bound when used alone. Defaults to 1.
 * @param max - Upper bound. When omitted, the lower bound is 0.
 * @returns A random number within the range.
 * @throws {RangeError} If either bound or the range size is not finite.
 * @example
 *
 * ```typescript
 * import { randomNumber } from '@ntnyq/utils'
 *
 * randomNumber() // => a number between 0 and 1
 * randomNumber(10) // => a number between 0 and 10
 * randomNumber(1.5, 3.5) // => a number between 1.5 and 3.5
 * ```
 */
export function randomNumber(min: number = 1, max?: number): number {
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

  if (min === max) {
    return min
  }

  const size = max - min
  if (!Number.isFinite(size)) {
    throw new RangeError('Random number range size must be finite')
  }

  return Math.random() * size + min
}
