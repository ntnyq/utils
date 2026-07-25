import { isPlainObject } from './isPlainObject'

export interface SortObjectKeysOptions {
  /**
   * Recursive sorting
   * @default false
   */
  deep?: boolean

  /**
   * Compare function
   */
  compareFn?: (left: string, right: string) => number
}

/**
 * Sorts an object's keys and optionally sorts nested plain objects recursively.
 * @param object - The object to sort.
 * @param options - Sorting options such as recursion and a custom compare function.
 * @returns A new object with keys sorted according to the provided options.
 *
 * @example
 *
 * ```typescript
 * import { sortObjectKeys } from '@ntnyq/utils'
 *
 * const result = sortObjectKeys({ c: 3, a: 1, b: 2 })
 * console.log(Object.keys(result)) // => ['a', 'b', 'c']
 * ```
 */
export function sortObjectKeys<T extends Record<string, any>>(
  object: T,
  options: SortObjectKeysOptions = {},
) {
  const { compareFn = (a, b) => a.localeCompare(b) } = options
  const sortedObjects = new WeakMap<object, object>()

  function sortKeys<R extends Record<string, any>>(obj: R) {
    const cached = sortedObjects.get(obj)
    if (cached) {
      return cached as R
    }

    const ownKeys = Reflect.ownKeys(obj)
    const sortedKeys = ownKeys
      .filter((key): key is string => typeof key === 'string')
      .toSorted(compareFn)
    const symbolKeys = ownKeys.filter(
      (key): key is symbol => typeof key === 'symbol',
    )
    const result = Object.create(Object.getPrototypeOf(obj)) as R
    sortedObjects.set(obj, result)

    for (const key of [...sortedKeys, ...symbolKeys]) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key)
      if (descriptor) {
        if (
          options.deep &&
          'value' in descriptor &&
          isPlainObject(descriptor.value)
        ) {
          descriptor.value = sortKeys(descriptor.value)
        }

        Object.defineProperty(result, key, descriptor)
      }
    }

    return result
  }
  return sortKeys(object) as T
}
