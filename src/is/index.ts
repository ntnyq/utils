/**
 * @file is utils
 * @module is
 * @copyright {@link https://github.com/sindresorhus/is}
 */

export type Whitespace = ' '
export type NonEmptyString = string & { 0: '' }

export function getObjectType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}
export function isNull(value: unknown): value is null {
  return value === null
}
export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}
export const isNullOrUndefined = isNil

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
export function isEmptyString(value: unknown): value is '' {
  return isString(value) && value.length === 0
}
export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return isString(value) && value.length > 0
}
export function isWhitespaceString(value: unknown): value is Whitespace {
  return isString(value) && /^\s*$/.test(value)
}
export function isEmptyStringOrWhitespace(value: unknown): value is '' | Whitespace {
  return isEmptyString(value) || isWhitespaceString(value)
}
export function isNumbericString(value: unknown): value is `${number}` {
  return isString(value) && !isEmptyStringOrWhitespace(value) && !Number.isNaN(Number(value))
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}
export function isZero(value: unknown): value is 0 {
  return value === 0
}
export function isNaN(value: unknown): value is typeof Number.NaN {
  return Number.isNaN(value)
}
export function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
export function isEmptyArray(value: unknown): value is [] {
  return isArray(value) && value.length === 0
}
export function isNonEmptyArray<T = unknown, Item = unknown>(
  value: T | Item[],
): value is [Item, ...Item[]] {
  return isArray(value) && value.length > 0
}

export function isObject(value: unknown): value is object {
  return (typeof value === 'object' || isFunction(value)) && !isNull(value)
}
export function isEmptyObject(value: unknown): value is {} {
  return isObject(value) && !isMap(value) && !isSet(value) && Object.keys(value).length === 0
}

export function isMap<Key = unknown, Value = unknown>(value: unknown): value is Map<Key, Value> {
  return getObjectType(value) === 'Map'
}

export function isEmptyMap(value: unknown): value is Map<never, never> {
  return isMap(value) && value.size === 0
}

export function isSet<Value = unknown>(value: unknown): value is Set<Value> {
  return getObjectType(value) === 'Set'
}

export function isEmptySet(value: unknown): value is Set<never> {
  return isSet(value) && value.size === 0
}

export function isRegExp(value: unknown): value is RegExp {
  return getObjectType(value) === 'RegExp'
}

export function isError(value: unknown): value is Error {
  return getObjectType(value) === 'Error'
}

/**
 * @internal
 */
function hasPromiseApi<T = unknown>(value: unknown): value is Promise<T> {
  return isFunction((value as Promise<T>)?.then) && isFunction((value as Promise<T>)?.catch)
}
export function isNativePromise<T = unknown>(value: unknown): value is Promise<T> {
  return getObjectType(value) === 'Promise'
}
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return isNativePromise(value) || hasPromiseApi(value)
}

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return isFunction((value as Iterable<T>)?.[Symbol.iterator])
}

export * from './isDeepEqual'
