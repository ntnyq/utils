import { isString } from './core'

// Regular expression for validating NanoID strings (21 characters, URL-friendly)
const RE_NANO_ID = /^[0-9a-zA-Z_-]{21}$/u

// Regular expression for validating UUID v1 to v8
const RE_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu

/**
 * Check if the value is a NanoID string.
 *
 * @param value - The value to check.
 * @returns true if the value is a NanoID string, otherwise false.
 * @example
 *
 * ```typescript
 * import { isNanoID } from '@ntnyq/utils'
 *
 * const result = isNanoID('V1StGXR8_Z5jdHi6B-myT')
 * console.log(result) // => true
 * ```
 *
 */
export function isNanoID(value: unknown): boolean {
  if (!isString(value)) {
    return false
  }
  return RE_NANO_ID.test(value)
}

/**
 * Check if the value is a UUID string.
 *
 * @description This function validates UUID strings of versions 1 to 8, ensuring they follow the standard format.
 * @param value - The value to check.
 * @returns true if the value is a UUID string, otherwise false.
 * @example
 *
 * ```typescript
 * import { isUUID } from '@ntnyq/utils'
 *
 * const result = isUUID('123e4567-e89b-12d3-a456-426614174000')
 * console.log(result) // => true
 * ```
 *
 */
export function isUUID(value: unknown): boolean {
  if (!isString(value)) {
    return false
  }
  return RE_UUID.test(value)
}
