export type MapValuesMapper<T extends object, Result> = (
  value: T[keyof T],
  key: keyof T,
  object: T,
) => Result

export type MapValuesResult<T extends object, Result> = {
  [Key in keyof T]: Result
}

/**
 * Maps an object's own enumerable values while preserving its key types.
 *
 * String and symbol keys are supported. The source object is not mutated.
 *
 * @param object - Source object.
 * @param mapper - Maps each value with its key and the source object.
 * @returns A new object containing the mapped values.
 *
 * @example
 *
 * ```typescript
 * import { mapValues } from '@ntnyq/utils'
 *
 * const result = mapValues({ first: 1, second: 2 }, value => value * 2)
 * console.log(result) // => { first: 2, second: 4 }
 * ```
 */
export function mapValues<T extends object, Result>(
  object: T,
  mapper: MapValuesMapper<T, Result>,
): MapValuesResult<T, Result> {
  const result = {} as MapValuesResult<T, Result>

  for (const key of Reflect.ownKeys(object)) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key)
    if (descriptor?.enumerable) {
      Object.defineProperty(result, key, {
        configurable: true,
        enumerable: true,
        value: mapper(object[key as keyof T], key as keyof T, object),
        writable: true,
      })
    }
  }

  return result
}
