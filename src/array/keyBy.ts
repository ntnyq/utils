import { isFunction, isNumber, isString, isSymbol } from '../predicate'
import type { PropertyKeyOf } from '../types'

/**
 * Indexes array items by a property key or selector.
 *
 * When multiple items resolve to the same key, the last item wins.
 *
 * @param array - Source array.
 * @param key - Property key or selector used to resolve each result key.
 * @returns An object containing the last item for every resolved key.
 *
 * @example
 *
 * ```typescript
 * import { keyBy } from '@ntnyq/utils'
 *
 * const users = [
 *   { id: 'a', name: 'Alice' },
 *   { id: 'b', name: 'Bob' },
 * ]
 *
 * const usersById = keyBy(users, 'id')
 * console.log(usersById.a?.name) // => 'Alice'
 * ```
 */
export function keyBy<T, Key extends PropertyKey>(
  array: readonly T[],
  key: (item: T, index: number, array: readonly T[]) => Key,
): Partial<Record<Key, T>>

export function keyBy<Key extends PropertyKey>(
  array: readonly never[],
  key: Key,
): Partial<Record<Key, never>>

export function keyBy<T, Key extends PropertyKeyOf<T>>(
  array: readonly T[],
  key: Key,
): Partial<Record<Extract<T[Key], PropertyKey>, T>>

export function keyBy<T>(
  array: readonly T[],
  key:
    | PropertyKey
    | ((item: T, index: number, array: readonly T[]) => PropertyKey),
): Partial<Record<PropertyKey, T>> {
  const entries = new Map<PropertyKey, T>()

  array.forEach((item, index) => {
    const entryKey = isFunction(key)
      ? key(item, index, array)
      : (item as Record<PropertyKey, unknown>)[key]

    if (!isString(entryKey) && !isNumber(entryKey) && !isSymbol(entryKey)) {
      throw new TypeError('Index key must be a property key')
    }

    entries.set(entryKey, item)
  })

  return Object.fromEntries(entries)
}
