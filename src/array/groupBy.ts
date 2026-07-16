type PropertyKeyOf<T> = {
  [K in keyof T]-?: T[K] extends PropertyKey ? K : never
}[keyof T]

/**
 * Groups the elements of an array based on a specified key or a function that returns a key.
 * @param array The array to be grouped.
 * @param key A string representing the property name to group by, or a function that takes an item and returns a string key.
 * @returns An object where the keys are the group identifiers and the values are arrays of items that belong to each group.
 *
 * @example
 *
 * ```typescript
 * const data = [
 *  { name: 'Alice', age: 30 },
 *  { name: 'Bob', age: 25 },
 *  { name: 'Charlie', age: 30 },
 * ]
 * const groupedByAge = groupBy(data, 'age')
 *
 * console.log(groupedByAge)
 * // Output:
 * // {
 * //   '25': [{ name: 'Bob', age: 25 }],
 * //   '30': [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }],
 * // }
 *
 * const groupedByNameLength = groupBy(data, item => item.name.length)
 *
 * console.log(groupedByNameLength)
 * // Output:
 * // {
 * //   '3': [{ name: 'Bob', age: 25 }],
 * //   '5': [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }],
 * // }
 * ```
 */
export function groupBy<T, Key extends PropertyKey>(
  array: readonly T[],
  key: (item: T) => Key,
): Partial<Record<Key, T[]>>

export function groupBy<Key extends PropertyKey>(
  array: readonly never[],
  key: Key,
): Partial<Record<Key, never[]>>

export function groupBy<T, Key extends PropertyKeyOf<T>>(
  array: readonly T[],
  key: Key,
): Partial<Record<Extract<T[Key], PropertyKey>, T[]>>

export function groupBy<T>(
  array: readonly T[],
  key: PropertyKey | ((item: T) => PropertyKey),
): Partial<Record<PropertyKey, T[]>> {
  const groups = new Map<PropertyKey, T[]>()

  for (const item of array) {
    const groupKey =
      typeof key === 'function'
        ? key(item)
        : (item as Record<PropertyKey, unknown>)[key]

    if (
      typeof groupKey !== 'string' &&
      typeof groupKey !== 'number' &&
      typeof groupKey !== 'symbol'
    ) {
      throw new TypeError('Group key must be a property key')
    }

    const group = groups.get(groupKey)
    if (group) {
      group.push(item)
    } else {
      groups.set(groupKey, [item])
    }
  }

  return Object.fromEntries(groups)
}
