import { toArray } from './toArray'
import type { Arrayable, Nullable } from '../types'

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten the result
 * @param array - given array
 * @returns Array<T>
 */
export function flattenArrayable<T>(
  array?: Nullable<Arrayable<T | Array<T>>>,
): Array<T> {
  return toArray(array).flat(1) as Array<T>
}

/**
 * Use rest arguments to merge arrays
 * @param args - rest arguments
 * @returns Array<T>
 */
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): Array<T> {
  return args.flatMap(i => toArray(i))
}
