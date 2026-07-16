import { isPlainObject } from './isPlainObject'

export interface SortObjectOptions {
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
 * import { sortObject } from '@ntnyq/utils'
 *
 * const result = sortObject({ c: 3, a: 1, b: 2 })
 * console.log(Object.keys(result)) // => ['a', 'b', 'c']
 * ```
 */
export function sortObject<T extends Record<string, any>>(
  object: T,
  options: SortObjectOptions = {},
) {
  const { compareFn = (a, b) => a.localeCompare(b) } = options

  function sortKeys<R extends Record<string, any>>(obj: R) {
    const ownKeys = Reflect.ownKeys(obj)
    const sortedKeys = ownKeys
      .filter((key): key is string => typeof key === 'string')
      .toSorted(compareFn)
    const symbolKeys = ownKeys.filter(
      (key): key is symbol => typeof key === 'symbol',
    )
    const result = Object.create(Object.getPrototypeOf(obj)) as R

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
