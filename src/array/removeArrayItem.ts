/**
 * Returns a new array without the first matching item.
 * @param array - The source array.
 * @param value - The item to remove.
 * @returns A new array without the first matching item.
 * @example
 *
 * ```typescript
 * import { removeArrayItem } from '@ntnyq/utils'
 *
 * const list = [1, 2, 3]
 * const result = removeArrayItem(list, 2)
 * console.log(result) // => [1, 3]
 * ```
 *
 */
export function removeArrayItem<T>(array: readonly T[], value: T): T[] {
  const result = [...array]
  removeArrayItemInPlace(result, value)
  return result
}

/**
 * Removes the first matching item from an array in place.
 * @param array - The source array to mutate.
 * @param value - The item to remove.
 * @returns True when an item was removed.
 */
export function removeArrayItemInPlace<T>(array: T[], value: T): boolean {
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
