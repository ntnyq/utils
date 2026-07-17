import { isObject } from '../predicate'

/**
 * Checks whether a value is a plain object rather than a built-in or custom class instance.
 * @param value - The value to check.
 * @returns True if the value is a plain object.
 * @copyright {@link https://github.com/sindresorhus/is/blob/main/source/index.ts}
 *
 * @example
 *
 * ```typescript
 * import { isPlainObject } from '@ntnyq/utils'
 *
 * const result = isPlainObject({ a: 1 })
 * console.log(result) // => true
 * ```
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
