import type { Arrayable, Nullable } from '../types'

export function toArray<T>(val?: Nullable<Arrayable<T>>): Arrayable<T> {
  val = val ?? []
  return Array.isArray(val) ? val : [val]
}
