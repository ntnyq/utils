import type { Nullable } from '../types'
import { toArray } from './toArray'

/**
 * Normalize a scalar or readonly array and flatten one level into a new array.
 * @param array - given array
 * @returns Array<T>
 * @example
 *
 * ```typescript
 * import { flattenArrayable } from '@ntnyq/utils'
 *
 * const result = flattenArrayable([1, [2, 3], 4])
 * console.log(result) // => [1, 2, 3, 4]
 * ```
 *
 */
export function flattenArrayable<T>(
  array?: Nullable<T | readonly (T | readonly T[])[]>,
): T[] {
  return toArray(array).flat() as T[]
}

/**
 * Merge scalars and readonly arrays into a new array, skipping nullish arguments.
 * @param args - rest arguments
 * @returns Array<T>
 * @example
 *
 * ```typescript
 * import { mergeArrayable } from '@ntnyq/utils'
 *
 * const result = mergeArrayable(1, [2, 3], null, 4)
 * console.log(result) // => [1, 2, 3, 4]
 * ```
 *
 */
export function mergeArrayable<T>(
  ...args: (Nullable<T | readonly T[]> | undefined)[]
): T[] {
  return args.flatMap(item => item ?? [])
}
