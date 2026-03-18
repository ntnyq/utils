import type { Arrayable, Nullable } from '../types'
import { toArray } from './toArray'

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten the result
 * @param array - given array
 * @returns Array<T>
 */
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | T[]>>): T[] {
  return toArray(array).flat() as T[]
}

/**
 * Use rest arguments to merge arrays
 * @param args - rest arguments
 * @returns Array<T>
 */
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): T[] {
  return args.flatMap(i => toArray(i))
}
