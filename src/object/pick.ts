import { isUndefined } from '../predicate'
import { hasOwn } from './hasOwn'

export interface ObjectPickOptions {
  /**
   * If true, properties with `undefined` values will be omitted from the result object.
   * @default false
   */
  omitUndefined?: boolean
}

/**
 * Creates an object composed of the picked object properties.
 * @param object - The source object.
 * @param keys - The property keys to pick.
 * @param options - Optional settings for picking properties.
 * @returns An object composed of the picked properties.
 *
 * @example
 *
 * ```typescript
 * const object = { a: 1, b: '2', c: 3 }
 * const result = pick(object, ['a', 'c'])
 * console.log(result) // => { a: 1, c: 3 }
 * ```
 */
export function pick<T, K extends keyof T>(
  object: T,
  keys: K[],
  options: ObjectPickOptions = {},
): Pick<T, K> {
  const { omitUndefined = false } = options
  return keys.reduce(
    (result, key) => {
      if (object && hasOwn(object, key)) {
        if (omitUndefined && isUndefined(object[key])) {
          return result
        }
        result[key] = object[key]
      }
      return result
    },
    {} as Pick<T, K>,
  )
}
