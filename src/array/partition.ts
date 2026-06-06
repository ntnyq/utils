/**
 * Splits an array into two groups in one pass.
 * @param array - Source array.
 * @param predicate - Partition predicate.
 * @returns A tuple of `[matched, unmatched]` arrays.
 *
 * @example
 *
 * ```typescript
 * import { partition } from '@ntnyq/utils'
 *
 * const [even, odd] = partition([1, 2, 3, 4], n => n % 2 === 0)
 * console.log(even, odd) // => [2, 4] [1, 3]
 * ```
 */
export function partition<T, Selected extends T>(
  array: readonly T[],
  predicate: (
    value: T,
    index: number,
    array: readonly T[],
  ) => value is Selected,
): [Selected[], Exclude<T, Selected>[]]

export function partition<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
): [T[], T[]]

export function partition<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
): [T[], T[]] {
  const matched: T[] = []
  const unmatched: T[] = []

  array.forEach((item, index) => {
    if (predicate(item, index, array)) {
      matched.push(item)
      return
    }
    unmatched.push(item)
  })

  return [matched, unmatched]
}
