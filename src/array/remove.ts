/**
 * Remove given item from an array
 * @param array - given array
 * @param value - item to be removed
 * @returns true if item was removed, otherwise false
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!array) return false

  const index = array.indexOf(value)

  if (index !== -1) {
    array.splice(index, 1)
    return true
  }

  return false
}
