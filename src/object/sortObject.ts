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
 * Sort object properties
 */
export function sortObject<T extends Record<string, any>>(
  object: T,
  options: SortObjectOptions = {},
) {
  const { compareFn = (a, b) => a.localeCompare(b) } = options

  function sortKeys<R extends Record<string, any>>(obj: R) {
    // oxlint-disable-next-line unicorn/no-array-sort
    const sortedKeys = Object.keys(obj).sort(compareFn)
    const result = {}

    for (const key of sortedKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = obj[key]
      let newValue: any

      if (options.deep && isPlainObject(value)) {
        newValue = sortKeys(value)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        newValue = value
      }

      Object.defineProperty(result, key, {
        ...Object.getOwnPropertyDescriptor(obj, key),
        value: newValue,
      })
    }

    return result
  }
  return sortKeys(object) as T
}
