import {
  isEmptyArray,
  isEmptyMap,
  isEmptyObject,
  isEmptySet,
  isEmptyString,
  isNull,
  isUndefined,
} from './core'

/**
 * Check if value is empty
 * @param value - The value to check
 * @returns True if the value is `null`, `undefined`, empty string, empty array, empty object, empty set, empty map, false otherwise
 */
export function isAllEmpty(value: unknown): boolean {
  if (
    isNull(value) ||
    isUndefined(value) ||
    isEmptyString(value) ||
    isEmptyArray(value) ||
    isEmptySet(value) ||
    isEmptyMap(value) ||
    isEmptyObject(value)
  ) {
    return true
  }

  return false
}
