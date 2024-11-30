/**
 * @file time utils
 * @module Time
 */

const ONE_SECOND = 1000
const ONE_MINUTE = 60 * ONE_SECOND
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_WEEK = 7 * ONE_DAY

export function seconds(count: number) {
  return count * ONE_SECOND
}

export function minutes(count: number) {
  return count * ONE_MINUTE
}

export function hours(count: number) {
  return count * ONE_HOUR
}

export function days(count: number) {
  return count * ONE_DAY
}

export function weeks(count: number) {
  return count * ONE_WEEK
}
