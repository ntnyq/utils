import { getObjectType, isArray, isObject } from './core'

/**
 * Checks whether two values are deeply equal.
 * @param value1 - The first value to compare.
 * @param value2 - The second value to compare.
 * @returns True if the two values are deeply equal, or false otherwise.
 *
 * @example
 *
 * ```typescript
 * import { isDeepEqual } from '@ntnyq/utils'
 *
 * const result = isDeepEqual({ a: 1 }, { a: 1 })
 * console.log(result) // => true
 * ```
 */
export function isDeepEqual(value1: any, value2: any): boolean {
  const type1 = getObjectType(value1)
  const type2 = getObjectType(value2)

  if (type1 !== type2) {
    return false
  }

  if (isArray(value1) && isArray(value2)) {
    if (value1.length !== value2.length) {
      return false
    }
    return value1.every((item, index) => isDeepEqual(item, value2[index]))
  }

  if (isObject(value1) && isObject(value2)) {
    const keys = Object.keys(value1)

    if (keys.length !== Object.keys(value2).length) {
      return false
    }

    return keys.every(key =>
      isDeepEqual(
        value1[key as keyof typeof value1],
        value2[key as keyof typeof value1],
      ),
    )
  }

  return Object.is(value1, value2)
}
