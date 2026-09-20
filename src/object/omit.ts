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
export function omit<T extends object, K extends keyof T = never>(
  object: T,
  keys: readonly K[] = [],
  options: ObjectOmitOptions = {},
): Omit<T, K> {
  const { omitUndefined = false } = options
  const result = Object.create(Object.getPrototypeOf(object)) as T
  const omittedKeys = new Set<PropertyKey>(keys)

  for (const key of Reflect.ownKeys(object)) {
    if (!omittedKeys.has(key)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key)
      if (
        descriptor &&
        (!omitUndefined ||
          !('value' in descriptor) ||
          !isUndefined(descriptor.value))
      ) {
        Object.defineProperty(result, key, descriptor)
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
