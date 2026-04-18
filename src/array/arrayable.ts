import type { Arrayable, Nullable } from '../types'
import { toArray } from './toArray'

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten the result
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
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | T[]>>): T[] {
  return toArray(array).flat() as T[]
}

/**
 * Use rest arguments to merge arrays
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
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): T[] {
  return args.flatMap(i => toArray(i))
}
