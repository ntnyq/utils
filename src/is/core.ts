/**
 * @file is utils
 * @module is
 * @copyright {@link https://github.com/sindresorhus/is}
 */

export type Whitespace = ' '
export type NonEmptyString = string & { 0: '' }

/**
 * Gets the internal object type name of a value.
 * @param value - The value to inspect.
 * @returns The object type string such as String, Array, or Map.
 *
 * @example
 *
 * ```typescript
 * import { getObjectType } from '@ntnyq/utils'
 *
 * const result = getObjectType(new Map())
 * console.log(result) // => 'Map'
 * ```
 */
export function getObjectType(value: unknown): string {
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
 * import { isNumbericString } from '@ntnyq/utils'
 *
 * const result = isNumbericString('123.45')
 * console.log(result) // => true
 * ```
 */
export function isNumbericString(value: unknown): value is `${number}` {
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
export function isInteger(value: unknown): value is number {
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

/**
 * Checks whether a value is an array.
 * @param value - The value to test.
 * @returns True if the value is an array.
 *
 * @example
 *
 * ```typescript
 * import { isArray } from '@ntnyq/utils'
 *
 * const result = isArray([1, 2, 3])
 * console.log(result) // => true
 * ```
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Checks whether a value is an empty array.
 * @param value - The value to test.
 * @returns True if the value is an empty array.
 *
 * @example
 *
 * ```typescript
 * import { isEmptyArray } from '@ntnyq/utils'
 *
 * const result = isEmptyArray([])
 * console.log(result) // => true
 * ```
 */
export function isEmptyArray(value: unknown): value is [] {
  return isArray(value) && value.length === 0
}

/**
 * Checks whether a value is a non-empty array.
 * @param value - The value to test.
 * @returns True if the value is an array containing at least one item.
 *
 * @example
 *
 * ```typescript
 * import { isNonEmptyArray } from '@ntnyq/utils'
 *
 * const result = isNonEmptyArray([1, 2, 3])
 * console.log(result) // => true
 * ```
 */
export function isNonEmptyArray<T = unknown, Item = unknown>(
  value: T | Item[],
): value is [Item, ...Item[]] {
  return isArray(value) && value.length > 0
}

/**
 * Checks whether a value is a Map.
 * @param value - The value to test.
 * @returns True if the value is a Map instance.
 *
 * @example
 *
 * ```typescript
 * import { isMap } from '@ntnyq/utils'
 *
 * const result = isMap(new Map())
 * console.log(result) // => true
 * ```
 */
export function isMap<Key = unknown, Value = unknown>(
  value: unknown,
): value is Map<Key, Value> {
  return getObjectType(value) === 'Map'
}

/**
 * Checks whether a value is an empty Map.
 * @param value - The value to test.
 * @returns True if the value is a Map with no entries.
 *
 * @example
 *
 * ```typescript
 * import { isEmptyMap } from '@ntnyq/utils'
 *
 * const result = isEmptyMap(new Map())
 * console.log(result) // => true
 * ```
 */
export function isEmptyMap(value: unknown): value is Map<never, never> {
  return isMap(value) && value.size === 0
}

/**
 * Checks whether a value is a Set.
 * @param value - The value to test.
 * @returns True if the value is a Set instance.
 *
 * @example
 *
 * ```typescript
 * import { isSet } from '@ntnyq/utils'
 *
 * const result = isSet(new Set([1]))
 * console.log(result) // => true
 * ```
 */
export function isSet<Value = unknown>(value: unknown): value is Set<Value> {
  return getObjectType(value) === 'Set'
}

/**
 * Checks whether a value is an empty Set.
 * @param value - The value to test.
 * @returns True if the value is a Set with no entries.
 *
 * @example
 *
 * ```typescript
 * import { isEmptySet } from '@ntnyq/utils'
 *
 * const result = isEmptySet(new Set())
 * console.log(result) // => true
 * ```
 */
export function isEmptySet(value: unknown): value is Set<never> {
  return isSet(value) && value.size === 0
}

/**
 * Checks whether a value is an object or function-like object.
 * @param value - The value to test.
 * @returns True if the value is a non-null object.
 *
 * @example
 *
 * ```typescript
 * import { isObject } from '@ntnyq/utils'
 *
 * const result = isObject({ foo: 'bar' })
 * console.log(result) // => true
 * ```
 */
export function isObject(value: unknown): value is object {
  return (typeof value === 'object' || isFunction(value)) && !isNull(value)
}

/**
 * Checks whether a value is an empty plain object.
 * @param value - The value to test.
 * @returns True if the value is an object with no own keys.
 *
 * @example
 *
 * ```typescript
 * import { isEmptyObject } from '@ntnyq/utils'
 *
 * const result = isEmptyObject({})
 * console.log(result) // => true
 * ```
 */
export function isEmptyObject(value: unknown): value is {} {
  return (
    isObject(value) &&
    !isMap(value) &&
    !isSet(value) &&
    Object.keys(value).length === 0
  )
}

/**
 * Checks whether a value is a record-like object.
 * @param value - The value to test.
 * @returns True if the value is a non-array object.
 *
 * @example
 *
 * ```typescript
 * import { isRecord } from '@ntnyq/utils'
 *
 * const result = isRecord({ foo: 'bar' })
 * console.log(result) // => true
 * ```
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value) && !isArray(value)
}

/**
 * Checks whether a value is a regular expression.
 * @param value - The value to test.
 * @returns True if the value is a RegExp instance.
 *
 * @example
 *
 * ```typescript
 * import { isRegExp } from '@ntnyq/utils'
 *
 * const result = isRegExp(/abc/)
 * console.log(result) // => true
 * ```
 */
export function isRegExp(value: unknown): value is RegExp {
  return getObjectType(value) === 'RegExp'
}

/**
 * Checks whether a value is an Error instance.
 * @param value - The value to test.
 * @returns True if the value is an Error.
 *
 * @example
 *
 * ```typescript
 * import { isError } from '@ntnyq/utils'
 *
 * const result = isError(new Error('boom'))
 * console.log(result) // => true
 * ```
 */
export function isError(value: unknown): value is Error {
  // TODO: use `Error.isError` when targeting node v24
  return getObjectType(value) === 'Error'
}

/**
 * @internal
 */
function hasPromiseApi<T = unknown>(value: unknown): value is Promise<T> {
  return (
    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction((value as Promise<T>)?.then) &&
    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction((value as Promise<T>)?.catch)
  )
}
/**
 * Checks whether a value is a native Promise instance.
 * @param value - The value to test.
 * @returns True if the value is a native Promise.
 *
 * @example
 *
 * ```typescript
 * import { isNativePromise } from '@ntnyq/utils'
 *
 * const result = isNativePromise(Promise.resolve(1))
 * console.log(result) // => true
 * ```
 */
export function isNativePromise<T = unknown>(
  value: unknown,
): value is Promise<T> {
  return getObjectType(value) === 'Promise'
}

/**
 * Checks whether a value behaves like a Promise.
 * @param value - The value to test.
 * @returns True if the value is promise-like.
 *
 * @example
 *
 * ```typescript
 * import { isPromise } from '@ntnyq/utils'
 *
 * const result = isPromise(Promise.resolve(1))
 * console.log(result) // => true
 * ```
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return isNativePromise(value) || hasPromiseApi(value)
}

/**
 * Checks whether a value is iterable.
 * @param value - The value to test.
 * @returns True if the value implements Symbol.iterator.
 *
 * @example
 *
 * ```typescript
 * import { isIterable } from '@ntnyq/utils'
 *
 * const result = isIterable(new Set([1, 2, 3]))
 * console.log(result) // => true
 * ```
 */
export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return isFunction((value as Iterable<T>)?.[Symbol.iterator])
}

/**
 * Checks whether a value is a Blob.
 * @param value - The value to test.
 * @returns True if the value is a Blob.
 *
 * @example
 *
 * ```typescript
 * import { isBlob } from '@ntnyq/utils'
 *
 * const result = isBlob(new Blob(['hello']))
 * console.log(result) // => true
 * ```
 */
export function isBlob(value: unknown): value is Blob {
  return getObjectType(value) === 'Blob'
}

/**
 * Checks whether a value is a FormData instance.
 * @param value - The value to test.
 * @returns True if the value is FormData.
 *
 * @example
 *
 * ```typescript
 * import { isFormData } from '@ntnyq/utils'
 *
 * const result = isFormData(new FormData())
 * console.log(result) // => true
 * ```
 */
export function isFormData(value: unknown): value is FormData {
  return getObjectType(value) === 'FormData'
}

/**
 * Checks whether a value is a File.
 * @param value - The value to test.
 * @returns True if the value is a File.
 *
 * @example
 *
 * ```typescript
 * import { isFile } from '@ntnyq/utils'
 *
 * const file = new File(['hello'], 'hello.txt')
 * const result = isFile(file)
 * console.log(result) // => true
 * ```
 */
export function isFile(value: unknown): value is File {
  return getObjectType(value) === 'File'
}

export type UrlString = string & { readonly __brand: 'UrlString' }

/**
 * Checks whether a value is a valid URL string.
 * @param value - The value to test.
 * @returns True if the value is a valid absolute URL string.
 *
 * @example
 *
 * ```typescript
 * import { isUrlString } from '@ntnyq/utils'
 *
 * const result = isUrlString('https://example.com')
 * console.log(result) // => true
 * ```
 */
export function isUrlString(value: unknown): value is UrlString {
  if (!isString(value)) {
    return false
  }
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch {
    return false
  }
}
