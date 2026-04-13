/**
 * @file time utils
 * @module Time
 */

/**
 * Time unit conversion constants (in milliseconds)
 */
export const TIME_UNITS = {
  MILLISECOND: 1,
  SECOND: 1000,
  // oxlint-disable-next-line no-magic-numbers
  MINUTE: (60 * 1000) as 60_000,
  // oxlint-disable-next-line no-magic-numbers
  HOUR: (60 * 60 * 1000) as 3_600_000,
  // oxlint-disable-next-line no-magic-numbers
  DAY: (24 * 60 * 60 * 1000) as 86_400_000,
  // oxlint-disable-next-line no-magic-numbers
  WEEK: (7 * 24 * 60 * 60 * 1000) as 604_800_000,
} as const

export type TimeUnit = keyof typeof TIME_UNITS

/**
 * Converts time units to milliseconds.
 * @param value - The time value.
 * @param fromUnit - The source unit (default: 'SECOND').
 * @returns The time in milliseconds.
 *
 * @example
 *
 * ```typescript
 * convertToMilliseconds(5, 'SECOND') // 5000
 * convertToMilliseconds(2, 'MINUTE') // 120000
 * convertToMilliseconds(1, 'HOUR') // 3600000
 * ```
 */
export function convertToMilliseconds(
  value: number,
  fromUnit: TimeUnit = 'SECOND',
): number {
  return value * TIME_UNITS[fromUnit]
}

/**
 * Converts milliseconds to specified time unit.
 * @param milliseconds - The time in milliseconds.
 * @param toUnit - The target unit (default: 'SECOND').
 * @returns The time in the specified unit.
 *
 * @example
 *
 * ```typescript
 * convertFromMilliseconds(5000, 'SECOND') // 5
 * convertFromMilliseconds(120000, 'MINUTE') // 2
 * convertFromMilliseconds(3600000, 'HOUR') // 1
 * ```
 */
export function convertFromMilliseconds(
  milliseconds: number,
  toUnit: TimeUnit = 'SECOND',
): number {
  return milliseconds / TIME_UNITS[toUnit]
}

/**
 * Converts between time units.
 * @param value - The time value.
 * @param fromUnit - The source unit.
 * @param toUnit - The target unit.
 * @returns The converted time.
 *
 * @example
 *
 * ```typescript
 * convertTimeUnit(1, 'HOUR', 'MINUTE') // 60
 * convertTimeUnit(120, 'SECOND', 'MINUTE') // 2
 * convertTimeUnit(2, 'WEEK', 'DAY') // 14
 * ```
 */
export function convertTimeUnit(
  value: number,
  fromUnit: TimeUnit,
  toUnit: TimeUnit,
): number {
  const milliseconds = convertToMilliseconds(value, fromUnit)
  return convertFromMilliseconds(milliseconds, toUnit)
}
