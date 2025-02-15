/**
 * Clamps a number between a minimum and maximum value
 * @param value - the value to clamp within the given range
 * @param min - the minimum value to clamp
 * @param max - the maximum value to clamp
 * @returns the new value
 */
export function clamp(
  value: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
): number {
  return Math.min(Math.max(value, min), max)
}
