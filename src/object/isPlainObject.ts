import { isObject } from '../is'

/**
 * Check if a value is a plain object (not an array, Date, RegExp, Map, Set, etc.)
 *
 * @param value - Checked value
 * @copyright {@link https://github.com/sindresorhus/is/blob/main/source/index.ts}
 */
export function isPlainObject<Value = unknown>(
  value: unknown,
): value is Record<PropertyKey, Value> {
  if (!isObject(value)) {
    return false
  }

  const prototype: unknown = Object.getPrototypeOf(value)

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  )
}
