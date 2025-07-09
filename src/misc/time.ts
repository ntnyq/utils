/**
 * @file time utils
 * @module Time
 */

/**
 * Converts seconds to milliseconds.
 * @param count - The number of seconds.
 * @returns The equivalent number of milliseconds.
 */
export function seconds(count: number): number {
  return count * 1000
}

/**
 * Converts minutes to milliseconds.
 * @param count - The number of minutes.
 * @returns The equivalent number of milliseconds.
 */
export function minutes(count: number): number {
  return count * 60 * 1000
}

/**
 * Converts hours to milliseconds.
 * @param count - The number of hours.
 * @returns The equivalent number of milliseconds.
 */
export function hours(count: number): number {
  return count * 60 * 60 * 1000
}

/**
 * Converts days to milliseconds.
 * @param count - The number of days.
 * @returns The equivalent number of milliseconds.
 */
export function days(count: number): number {
  return count * 24 * 60 * 60 * 1000
}

/**
 * Converts weeks to milliseconds.
 * @param count - The number of weeks.
 * @returns The equivalent number of milliseconds.
 */
export function weeks(count: number): number {
  return count * 7 * 24 * 60 * 60 * 1000
}
