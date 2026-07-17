/**
 * @file is utils
 * @module is
 * @copyright {@link https://github.com/sindresorhus/is}
 */

export type Whitespace = ' '
export type NonEmptyString = string & { 0: '' }

/**
 * Gets the `Object.prototype.toString` tag of a value.
 * @param value - The value to inspect.
 * @returns The object tag such as String, Array, or Map.
 *
 * @example
 *
 * ```typescript
 * import { getObjectTag } from '@ntnyq/utils'
 *
 * const result = getObjectTag(new Map())
 * console.log(result) // => 'Map'
 * ```
 */
export function getObjectTag(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * Checks whether a value is undefined.
 * @param value - The value to test.
 * @returns True if the value is undefined.
 *
 * @example
 *
 * ```typescript
 * import { isUndefined } from '@ntnyq/utils'
 *
 * const result = isUndefined(undefined)
 * console.log(result) // => true
 * ```
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Checks whether a value is null.
 * @param value - The value to test.
 * @returns True if the value is null.
 *
 * @example
 *
 * ```typescript
 * import { isNull } from '@ntnyq/utils'
 *
 * const result = isNull(null)
 * console.log(result) // => true
 * ```
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Checks whether a value is null or undefined.
 * @param value - The value to test.
 * @returns True if the value is null or undefined.
 *
 * @example
 *
 * ```typescript
 * import { isNil } from '@ntnyq/utils'
 *
 * const result = isNil(undefined)
 * console.log(result) // => true
 * ```
 */
export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}

/**
 * Alias of {@link isNil}.
 * @returns True if the value is null or undefined.
 *
 * @example
 *
 * ```typescript
 * import { isNullOrUndefined } from '@ntnyq/utils'
 *
 * const result = isNullOrUndefined(null)
 * console.log(result) // => true
 * ```
 */
export const isNullOrUndefined: typeof isNil = isNil

/**
 * Checks whether a value is a string.
 * @param value - The value to test.
 * @returns True if the value is a string.
 *
 * @example
 *
 * ```typescript
 * import { isString } from '@ntnyq/utils'
 *
 * const result = isString('hello')
 * console.log(result) // => true
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Checks whether a value is an empty string.
 * @param value - The value to test.
 * @returns True if the value is an empty string.
 *
 * @example
 *
 * ```typescript
 * import { isEmptyString } from '@ntnyq/utils'
 *
 * const result = isEmptyString('')
 * console.log(result) // => true
 * ```
 */
export function isEmptyString(value: unknown): value is '' {
  return isString(value) && value.length === 0
}

/**
 * Checks whether a value is a non-empty string.
 * @param value - The value to test.
 * @returns True if the value is a string with at least one character.
 *
 * @example
 *
 * ```typescript
 * import { isNonEmptyString } from '@ntnyq/utils'
 *
 * const result = isNonEmptyString('hello')
 * console.log(result) // => true
 * ```
 */
export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return isString(value) && value.length > 0
}

/**
 * Checks whether a value is a string containing only whitespace.
 * @param value - The value to test.
 * @returns True if the value is a whitespace-only string.
 *
 * @example
 *
 * ```typescript
 * import { isWhitespaceString } from '@ntnyq/utils'
 *
 * const result = isWhitespaceString('   ')
 * console.log(result) // => true
 * ```
 */
export function isWhitespaceString(value: unknown): value is Whitespace {
  return isString(value) && /^\s*$/u.test(value)
}

/**
 * Checks whether a value is an empty string or only whitespace.
 * @param value - The value to test.
 * @returns True if the value is empty or contains only whitespace.
 *
 * @example
 *
 * ```typescript
 * import { isEmptyStringOrWhitespace } from '@ntnyq/utils'
 *
 * const result = isEmptyStringOrWhitespace(' ')
 * console.log(result) // => true
 * ```
 */
export function isEmptyStringOrWhitespace(
  value: unknown,
): value is '' | Whitespace {
  return isEmptyString(value) || isWhitespaceString(value)
}

/**
 * Checks whether a value is a numeric string.
 * @param value - The value to test.
 * @returns True if the value can be parsed as a number.
 *
 * @example
 *
 * ```typescript
 * import { isNumericString } from '@ntnyq/utils'
 *
 * const result = isNumericString('123.45')
 * console.log(result) // => true
 * ```
 */
export function isNumericString(value: unknown): value is `${number}` {
  return (
    isString(value) &&
    !isEmptyStringOrWhitespace(value) &&
    !Number.isNaN(Number(value))
  )
}

/**
 * Checks whether a value is a number.
 * @param value - The value to test.
 * @returns True if the value is a number.
 *
 * @example
 *
 * ```typescript
 * import { isNumber } from '@ntnyq/utils'
 *
 * const result = isNumber(42)
 * console.log(result) // => true
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Checks whether a value is exactly zero.
 * @param value - The value to test.
 * @returns True if the value is 0.
 *
 * @example
 *
 * ```typescript
 * import { isZero } from '@ntnyq/utils'
 *
 * const result = isZero(0)
 * console.log(result) // => true
 * ```
 */
export function isZero(value: unknown): value is 0 {
  return value === 0
}

/**
 * Checks whether a value is NaN.
 * @param value - The value to test.
 * @returns True if the value is NaN.
 *
 * @example
 *
 * ```typescript
 * import { isNaN } from '@ntnyq/utils'
 *
 * const result = isNaN(Number.NaN)
 * console.log(result) // => true
 * ```
 */
export function isNaN(value: unknown): boolean {
  return Number.isNaN(value)
}

/**
 * Checks whether a value is an integer.
 * @param value - The value to test.
 * @returns True if the value is an integer.
 *
 * @example
 *
 * ```typescript
 * import { isInteger } from '@ntnyq/utils'
 *
 * const result = isInteger(42)
 * console.log(result) // => true
 * ```
 */
export function isInteger(value: unknown): boolean {
  return Number.isInteger(value)
}

/**
 * Checks whether a value is a bigint.
 * @param value - The value to test.
 * @returns True if the value is a bigint.
 *
 * @example
 *
 * ```typescript
 * import { isBigInt } from '@ntnyq/utils'
 *
 * const result = isBigInt(42n)
 * console.log(result) // => true
 * ```
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

/**
 * Checks whether a value is a symbol.
 * @param value - The value to test.
 * @returns True if the value is a symbol.
 *
 * @example
 *
 * ```typescript
 * import { isSymbol } from '@ntnyq/utils'
 *
 * const result = isSymbol(Symbol('example'))
 * console.log(result) // => true
 * ```
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * Checks whether a value is a boolean.
 * @param value - The value to test.
 * @returns True if the value is a boolean.
 *
 * @example
 *
 * ```typescript
 * import { isBoolean } from '@ntnyq/utils'
 *
 * const result = isBoolean(false)
 * console.log(result) // => true
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Checks whether a value is a JavaScript primitive.
 * @param value - The value to test.
 * @returns True if the value is null, undefined, a string, number, boolean, symbol, or bigint.
 *
 * @example
 *
 * ```typescript
 * import { isPrimitive } from '@ntnyq/utils'
 *
 * const result = isPrimitive('hello')
 * console.log(result) // => true
 * ```
 */
export function isPrimitive(
  value: unknown,
): value is bigint | boolean | number | string | symbol | null | undefined {
  return (
    isNil(value) ||
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isSymbol(value) ||
    isBigInt(value)
  )
}

/**
 * Checks whether a value is truthy.
 * @param value - The value to test.
 * @returns True if the value is truthy.
 *
 * @example
 *
 * ```typescript
 * import { isTruthy } from '@ntnyq/utils'
 *
 * const result = isTruthy('hello')
 * console.log(result) // => true
 * ```
 */
// oxlint-disable-next-line unicorn/prefer-native-coercion-functions
export function isTruthy<T>(value: T | undefined): value is T {
  return Boolean(value)
}

/**
 * Checks whether a value is a function.
 * @param value - The value to test.
 * @returns True if the value is a function.
 *
 * @example
 *
 * ```typescript
 * import { isFunction } from '@ntnyq/utils'
 *
 * const result = isFunction(() => {})
 * console.log(result) // => true
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
