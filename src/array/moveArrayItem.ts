function normalizeArrayIndex(index: number, length: number): number {
  if (!Number.isSafeInteger(index)) {
    throw new RangeError('Array index must be a safe integer')
  }

  const normalizedIndex = index < 0 ? length + index : index
  if (normalizedIndex < 0 || normalizedIndex >= length) {
    throw new RangeError(`Array index ${index} is out of bounds`)
  }

  return normalizedIndex
}

/**
 * Moves an array item to another index without mutating the source array.
 *
 * Negative indexes are resolved from the end of the source array.
 *
 * @param items - Source items.
 * @param from - Index of the item to move.
 * @param to - Target index.
 * @returns A new array with the item moved.
 *
 * @example
 *
 * ```typescript
 * import { moveArrayItem } from '@ntnyq/utils'
 *
 * moveArrayItem(['a', 'b', 'c'], 0, 2)
 * // => ['b', 'c', 'a']
 * ```
 */
export function moveArrayItem<T>(
  items: readonly T[],
  from: number,
  to: number,
): T[] {
  const fromIndex = normalizeArrayIndex(from, items.length)
  const toIndex = normalizeArrayIndex(to, items.length)
  const movedItems = [...items]

  if (fromIndex !== toIndex) {
    movedItems.splice(toIndex, 0, ...movedItems.splice(fromIndex, 1))
  }

  return movedItems
}
