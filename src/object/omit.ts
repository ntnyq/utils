import { isUndefined } from '../predicate'

export interface ObjectOmitOptions {
  /**
   * Whether to omit properties with undefined values.
   * @default false
   */
  omitUndefined?: boolean
}

/**
 * Creates a new object without the selected keys.
 * @param object - The source object.
 * @param keys - The keys to omit.
 * @param options - Omission options.
 * @returns A new object without the selected keys.
 *
 * @example
 *
 * ```typescript
 * import { omit } from '@ntnyq/utils'
 *
 * const result = omit({ a: 1, b: 2, c: 3 }, ['b'])
 * console.log(result) // => { a: 1, c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[] = [],
  options: ObjectOmitOptions = {},
): Omit<T, K> {
  const { omitUndefined = false } = options
  const result = Object.create(Object.getPrototypeOf(object)) as T
  Object.defineProperties(result, Object.getOwnPropertyDescriptors(object))

  omitInPlace(result, ...keys)

  if (omitUndefined) {
    for (const key of Reflect.ownKeys(result)) {
      const descriptor = Object.getOwnPropertyDescriptor(result, key)
      if (
        descriptor &&
        'value' in descriptor &&
        isUndefined(descriptor.value)
      ) {
        Reflect.deleteProperty(result, key)
      }
    }
  }

  return result as Omit<T, K>
}

/**
 * Removes the selected keys from an object in place.
 * @param object - The source object to mutate.
 * @param keys - The keys to remove.
 * @returns The source object with the selected keys removed.
 */
export function omitInPlace<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Omit<T, K> {
  keys.forEach(key => delete object[key])
  return object
}
