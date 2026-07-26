import type { Nullable } from '../types'

export type ToArrayResult<Value> = Value extends null | undefined
  ? []
  : Value extends readonly unknown[]
    ? Value
    : Value[]

/**
 * Converts a value to an array while preserving existing mutable and readonly
 * array types.
 *
 * Existing arrays are returned by reference, nullish values become an empty
 * array, and other values are wrapped in a new array.
 *
 * @param array - The value to convert.
 * @returns The normalized array.
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
export function toArray<Value = undefined>(
  array?: Nullable<Value>,
): ToArrayResult<Value> {
  const value = array ?? []

  return (Array.isArray(value) ? value : [value]) as ToArrayResult<Value>
}
