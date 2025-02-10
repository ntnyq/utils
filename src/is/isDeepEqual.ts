import { getObjectType, isArray, isObject } from '.'

/**
 * check if two values are deeply equal
 */
export function isDeepEqual(value1: any, value2: any): boolean {
  const type1 = getObjectType(value1)
  const type2 = getObjectType(value2)

  if (type1 !== type2) {
    return false
  }

  if (isArray(value1)) {
    if (value1.length !== value2.length) {
      return false
    }
    return value1.every((item, index) => isDeepEqual(item, value2[index]))
  }

  if (isObject(value1)) {
    const keys = Object.keys(value1)

    if (keys.length !== Object.keys(value2).length) {
      return false
    }

    return keys.every(key =>
      isDeepEqual(value1[key as keyof typeof value1], value2[key]),
    )
  }

  return Object.is(value1, value2)
}
