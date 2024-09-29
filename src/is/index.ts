/**
 * @file is utils
 * @category is
 * @copyright {@link https://github.com/sindresorhus/is}
 */

export function getObjectType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
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
