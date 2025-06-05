/**
 * @file time utils
 * @module Time
 */

export const ONE_SECOND_MILLSECONDS: number = 1000
export const ONE_MINUTE_MILLSECONDS: number = 60 * ONE_SECOND_MILLSECONDS
export const ONE_HOUR_MILLSECONDS: number = 60 * ONE_MINUTE_MILLSECONDS
export const ONE_DAY_MILLSECONDS: number = 24 * ONE_HOUR_MILLSECONDS
export const ONE_WEEK_MILLSECONDS: number = 7 * ONE_DAY_MILLSECONDS

export function seconds(count: number): number {
  return count * ONE_SECOND_MILLSECONDS
}

export function minutes(count: number): number {
  return count * ONE_MINUTE_MILLSECONDS
}

export function hours(count: number): number {
  return count * ONE_HOUR_MILLSECONDS
}

export function days(count: number): number {
  return count * ONE_DAY_MILLSECONDS
}

export function weeks(count: number): number {
  return count * ONE_WEEK_MILLSECONDS
}
