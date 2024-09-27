import type { Arrayable, Nullable } from '../types'

/**
 * Converts a value to an array.
 * @param val - The value to convert.
 * @returns The array.
 */
export function toArray<T>(val?: Nullable<Arrayable<T>>): T[] {
  val = val ?? []
  return Array.isArray(val) ? val : [val]
}
