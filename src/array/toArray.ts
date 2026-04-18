import type { Arrayable, Nullable } from '../types'

/**
 * Converts a value to an array.
 * @param array - The value to convert.
 * @returns The array.
 * @example
 *
 * ```typescript
 * import { toArray } from '@ntnyq/utils'
 *
 * const result = toArray('hello')
 * console.log(result) // => ['hello']
 * ```
 *
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): T[] {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}
