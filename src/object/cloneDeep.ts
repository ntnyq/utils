import { isNull, isObject } from '../is'

/**
 * Deeply clones a value, handling circular references using a WeakMap.
 * @param value The value to be cloned.
 * @param hash - A WeakMap to track already cloned objects and handle circular references.
 * @returns A deep clone of the input value.
 */
export function cloneDeep<T>(
  value: T,
  hash: WeakMap<WeakKey, any> = new WeakMap<WeakKey, any>(),
): T {
  if (isNull(value) || !isObject(value)) {
    return value
  }
  const result: any = Array.isArray(value) ? [] : {}

  hash.set(value as WeakKey, result)

  Reflect.ownKeys(value).forEach(key => {
    result[key] = cloneDeep((value as any)[key], hash)
  })

  return result
}
