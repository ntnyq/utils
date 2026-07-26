/**
 * Returns source items whose selected keys do not occur in the excluded
 * array.
 *
 * Source order and duplicates are preserved. Selected keys use `Set`
 * SameValueZero equality.
 *
 * @param array - Source array.
 * @param excluded - Items whose selected keys should be excluded.
 * @param selector - Resolves a comparison key for each item.
 * @returns Source items with excluded keys removed.
 *
 * @example
 *
 * ```typescript
 * import { differenceBy } from '@ntnyq/utils'
 *
 * const result = differenceBy(
 *   [{ id: 1 }, { id: 2 }, { id: 3 }],
 *   [{ id: 2 }],
 *   item => item.id,
 * )
 * console.log(result) // => [{ id: 1 }, { id: 3 }]
 * ```
 */
export function differenceBy<T, Key>(
  array: readonly T[],
  excluded: readonly T[],
  selector: (item: T, index: number, array: readonly T[]) => Key,
): T[] {
  const excludedKeys = new Set(
    excluded.map((item, index) => selector(item, index, excluded)),
  )

  return array.filter(
    (item, index) => !excludedKeys.has(selector(item, index, array)),
  )
}
