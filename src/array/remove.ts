/**
 * Remove given item from an array
 * @param array - given array
 * @param value - item to be removed
 * @returns true if item was removed, otherwise false
 * @example
 *
 * ```typescript
 * import { remove } from '@ntnyq/utils'
 *
 * const list = [1, 2, 3]
 * remove(list, 2)
 * console.log(list) // => [1, 3]
 * ```
 *
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!array) {
    return false
  }

  const index = array.indexOf(value)

  if (index !== -1) {
    array.splice(index, 1)
    return true
  }

  return false
}
