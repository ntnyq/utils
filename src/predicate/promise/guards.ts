import { getObjectType, isFunction } from '../primitive'

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
