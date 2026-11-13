/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to round.
 * @param decimal - The number of decimal places to round to. Default is 0 (round to the nearest integer).
 * @returns The rounded number.
 *
 * @example
 *
 * ```typescript
 * import { round } from '@ntnyq/utils';
 *
 * round(1.2345); //=> 1
 * round(1.2345, 2); //=> 1.23
 * ```
 */
export function round(value: number, decimal: number = 0): number {
  // oxlint-disable-next-line prefer-exponentiation-operator
  const multiplier = Math.pow(10, decimal)
  if (Number.isNaN(multiplier)) {
    return Number.NaN
  }
  if (multiplier === 0) {
    if (!Number.isFinite(value)) {
      return value
    }
    return value < 0 || Object.is(value, -0) ? -0 : 0
  }
  const scaled = value * multiplier
  return Number.isFinite(scaled) ? Math.round(scaled) / multiplier : value
}
