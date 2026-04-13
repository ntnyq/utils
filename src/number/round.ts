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
  return Math.round(value * multiplier) / multiplier
}
