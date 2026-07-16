import { isUndefined } from '../is'

export interface ObjectOmitOptions {
  /**
   * If true, properties with undefined values will be omitted from the resulting object.
   * @default false
   */
  omitUndefined?: boolean
}

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
 */
export function objectOmit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[] = [],
  options: ObjectOmitOptions = {},
) {
  const { omitUndefined = false } = options

  return Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) =>
        !keys.includes(key as K) && !(omitUndefined && isUndefined(value)),
    ),
  ) as Omit<T, K>
}
