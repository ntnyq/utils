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
 * Returns a new array with unique values.
 * @param array - The array to process.
 * @param equalFn - The function to compare values.
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
 *
 */
export function uniqueBy<T>(array: T[], equalFn: (a: T, b: T) => boolean): T[] {
  return array.reduce<T[]>((acc, cur) => {
    const idx = acc.findIndex(item => equalFn(item, cur))
    if (idx === -1) {
      acc.push(cur)
    }
    return acc
  }, [])
}
