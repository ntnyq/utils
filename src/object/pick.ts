import { hasOwn } from './hasOwn'

export function pick<T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return Object.assign(
    {},
    // eslint-disable-next-line array-callback-return
    ...keys.map(key => {
      if (object && hasOwn(object, key)) {
        return { [key]: object[key] }
      }
    }),
  )
}
