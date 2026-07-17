import { getObjectTag, isFunction, isNull } from '../primitive'

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
  return getObjectTag(value) === 'Map'
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
 * Checks whether a value is a non-empty Map.
 * @param value - The value to test.
 * @returns True if the value is a Map containing at least one entry.
 *
 * @example
 *
 * ```typescript
 * import { isNonEmptyMap } from '@ntnyq/utils'
 *
 * const result = isNonEmptyMap(new Map([['key', 'value']]))
 * console.log(result) // => true
 * ```
 */
export function isNonEmptyMap<Key = unknown, Value = unknown>(
  value: unknown,
): value is Map<Key, Value> {
  return isMap<Key, Value>(value) && value.size > 0
}

/**
 * Checks whether a value is a WeakMap.
 * @param value - The value to test.
 * @returns True if the value is a WeakMap instance.
 *
 * @example
 *
 * ```typescript
 * import { isWeakMap } from '@ntnyq/utils'
 *
 * const result = isWeakMap(new WeakMap())
 * console.log(result) // => true
 * ```
 */
export function isWeakMap<Key extends WeakKey = WeakKey, Value = unknown>(
  value: unknown,
): value is WeakMap<Key, Value> {
  return getObjectTag(value) === 'WeakMap'
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
  return getObjectTag(value) === 'Set'
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
 * Checks whether a value is a non-empty Set.
 * @param value - The value to test.
 * @returns True if the value is a Set containing at least one entry.
 *
 * @example
 *
 * ```typescript
 * import { isNonEmptySet } from '@ntnyq/utils'
 *
 * const result = isNonEmptySet(new Set([1]))
 * console.log(result) // => true
 * ```
 */
export function isNonEmptySet<Value = unknown>(
  value: unknown,
): value is Set<Value> {
  return isSet<Value>(value) && value.size > 0
}

/**
 * Checks whether a value is a WeakSet.
 * @param value - The value to test.
 * @returns True if the value is a WeakSet instance.
 *
 * @example
 *
 * ```typescript
 * import { isWeakSet } from '@ntnyq/utils'
 *
 * const result = isWeakSet(new WeakSet())
 * console.log(result) // => true
 * ```
 */
export function isWeakSet<Value extends WeakKey = WeakKey>(
  value: unknown,
): value is WeakSet<Value> {
  return getObjectTag(value) === 'WeakSet'
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
 * Checks whether a value is an object with at least one own enumerable key.
 * @param value - The value to test.
 * @returns True if the value is an object with one or more own enumerable keys.
 *
 * @example
 *
 * ```typescript
 * import { isNonEmptyObject } from '@ntnyq/utils'
 *
 * const result = isNonEmptyObject({ key: 'value' })
 * console.log(result) // => true
 * ```
 */
export function isNonEmptyObject(value: unknown): value is object {
  return (
    isObject(value) &&
    !isMap(value) &&
    !isSet(value) &&
    Object.keys(value).length > 0
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
  return getObjectTag(value) === 'RegExp'
}

/**
 * Checks whether a value is a Date.
 * @param value - The value to test.
 * @returns True if the value is a Date instance.
 *
 * @example
 *
 * ```typescript
 * import { isDate } from '@ntnyq/utils'
 *
 * const result = isDate(new Date())
 * console.log(result) // => true
 * ```
 */
export function isDate(value: unknown): value is Date {
  return getObjectTag(value) === 'Date'
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
  return getObjectTag(value) === 'Error'
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
  return getObjectTag(value) === 'Blob'
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
  return getObjectTag(value) === 'FormData'
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
  return getObjectTag(value) === 'File'
}
