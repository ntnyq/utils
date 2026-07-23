import type { ObjectOmitOptions } from './omit'
import { omit } from './omit'

/**
 * Creates a new object by omitting specified keys from the original object. Optionally, properties with undefined values can also be omitted.
 * @param obj - The original object from which properties will be omitted.
 * @param keys - An array of keys that should be omitted from the resulting object.
 * @param options - An optional object that can contain the `omitUndefined` property to specify whether properties with undefined values should also be omitted.
 * @returns A new object that includes all properties from the original object except those specified in the `keys` array and, if `omitUndefined` is true, those with undefined values.
 *
 * @example
 *
 * ```typescript
 * const original = { a: 1, b: 2, c: undefined }
 * const result = objectOmit(original, ['b'], { omitUndefined: true })
 * console.log(result) // Output: { a: 1 }
 * ```
 *
 * @deprecated Use {@link omit} instead.
 */
export function objectOmit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[] = [],
  options: ObjectOmitOptions = {},
): Omit<T, K> {
  return omit(obj, keys, options)
}
