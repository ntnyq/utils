import { isFunction } from '../is'

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
export function groupBy<T>(
  array: T[],
  key: string | ((item: T) => string),
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = isFunction(key) ? key(item) : key
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>,
  )
}
