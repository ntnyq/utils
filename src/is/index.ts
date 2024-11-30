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

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
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

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value)
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

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value)
}

export function isObject(value: unknown): value is object {
  return getObjectType(value) === 'Object'
}

export function isRegExp(value: unknown): value is RegExp {
  return getObjectType(value) === 'RegExp'
}

export function isSet<Value = unknown>(value: unknown): value is Set<Value> {
  return getObjectType(value) === 'Set'
}

export function isNativePromise<T = unknown>(value: unknown): value is Promise<T> {
  return getObjectType(value) === 'Promise'
}

/**
 * @internal
 */
function hasPromiseApi<T = unknown>(value: unknown): value is Promise<T> {
  return isFunction((value as Promise<T>)?.then) && isFunction((value as Promise<T>)?.catch)
}
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return isNativePromise(value) || hasPromiseApi(value)
}
