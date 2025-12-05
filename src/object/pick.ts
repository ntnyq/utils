import { hasOwn } from './hasOwn'

export function pick<T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return keys.reduce(
    (result, key) => {
      if (object && hasOwn(object, key)) {
        result[key] = object[key]
      }
      return result
    },
    {} as Pick<T, K>,
  )
}
