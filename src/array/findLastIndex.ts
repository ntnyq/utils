/**
 * Index returned when no array item satisfies the predicate.
 */
const NOT_EXIST = -1

/**
 * Finds the index of the last array item that satisfies a predicate.
 *
 * Searches backward from the inclusive starting index without mutating the
 * source. Negative indexes count from the end; out-of-bounds indexes are
 * clamped to the first or last index. Sparse slots are visited as undefined.
 *
 * @param array - Source array.
 * @param predicate - Receives the item, index, and original array.
 * @param fromIndex - Starting index, defaults to the last index. Fractions are
 * truncated toward zero and NaN is treated as zero.
 * @returns The matching index, or -1 when no item matches.
 *
 * @example
 *
 * ```typescript
 * import { findLastIndex } from '@ntnyq/utils'
 *
 * findLastIndex([1, 2, 3, 2], value => value === 2) // => 3
 * findLastIndex([1, 2, 3, 2], value => value === 2, -2) // => 1
 * ```
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => unknown,
  fromIndex: number = array.length - 1,
): number {
  const length = array.length

  if (length === 0) {
    return NOT_EXIST
  }

  const startIndex = Math.trunc(fromIndex) || 0
  const lastIndex =
    startIndex < 0
      ? Math.max(length + startIndex, 0)
      : Math.min(startIndex, length - 1)

  for (let index = lastIndex; index >= 0; index--) {
    if (predicate(array[index]!, index, array)) {
      return index
    }
  }

  return NOT_EXIST
}
