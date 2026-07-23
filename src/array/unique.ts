/**
 * Returns a new array with unique values.
 * @param array - The array to process.
 * @returns The new array.
 * @example
 *
 * ```typescript
 * import { unique } from '@ntnyq/utils'
 *
 * const result = unique([1, 1, 2, 3, 3])
 * console.log(result) // => [1, 2, 3]
 * ```
 *
 */
export function unique<T>(array: T[]): T[] {
  // oxlint-disable-next-line unicorn/prefer-spread
  return Array.from(new Set(array))
}

/**
 * Returns a new array with unique values selected by key.
 * @param array - The array to process.
 * @param selector - Resolves the uniqueness key for each item.
 * @returns The new array.
 * @example
 *
 * ```typescript
 * import { uniqueBy } from '@ntnyq/utils'
 *
 * const result = uniqueBy([
 *   { id: 1, name: 'Alice' },
 *   { id: 1, name: 'Alice 2' },
 *   { id: 2, name: 'Bob' },
 * ], item => item.id)
 * console.log(result.length) // => 2
 * ```
 */
export function uniqueBy<T, Key>(
  array: readonly T[],
  selector: (item: T, index: number, array: readonly T[]) => Key,
): T[] {
  const seen = new Set<Key>()

  return array.filter((item, index) => {
    const key = selector(item, index, array)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Returns a new array with unique values using a custom equality function.
 * @param array - The array to process.
 * @param equals - Returns true when two values should be treated as equal.
 * @returns The new array.
 * @example
 *
 * ```typescript
 * import { uniqueWith } from '@ntnyq/utils'
 *
 * const result = uniqueWith(
 *   [{ id: 1 }, { id: 1 }, { id: 2 }],
 *   (left, right) => left.id === right.id,
 * )
 * console.log(result.length) // => 2
 * ```
 */
export function uniqueWith<T>(
  array: readonly T[],
  equals: (left: T, right: T) => boolean,
): T[] {
  return array.reduce<T[]>((acc, cur) => {
    const idx = acc.findIndex(item => equals(item, cur))
    if (idx === -1) {
      acc.push(cur)
    }
    return acc
  }, [])
}
