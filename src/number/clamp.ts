/**
 * Clamps a number between a minimum and maximum value
 * @param value - the value to clamp within the given range
 * @param min - the minimum value to clamp
 * @param max - the maximum value to clamp
 * @returns the new value
 * @example
 *
 * ```typescript
 * import { clamp } from '@ntnyq/utils'
 *
 * const result = clamp(15, 0, 10)
 * console.log(result) // => 10
 * ```
 *
 */
export function clamp(
  value: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
): number {
  const [low, high] = [Math.min(min, max), Math.max(min, max)]
  return Math.min(Math.max(value, low), high)
}
