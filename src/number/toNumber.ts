import { isNaN, isNumber, isString } from '../is'

/**
 * Converts `value` to a number.
 * @param value The value to process.
 * @returns Returns the number.
 * @example
 *
 * ```typescript
 * import { toNumber } from '@ntnyq/utils'
 *
 * const result = toNumber('3.14')
 * console.log(result) // => 3.14
 * ```
 */
export function toNumber(value: string | number): number {
  if (!isString(value) && !isNumber(value)) {
    throw new TypeError(`Expected a string or number, got ${typeof value}`)
  }
  if (isNaN(value)) {
    throw new TypeError(`Expected a valid number, got NaN`)
  }
  if (isString(value)) {
    // oxlint-disable-next-line unicorn/prefer-number-coercion
    const result = Number.parseFloat(value)
    if (isNaN(result)) {
      throw new TypeError(`Expected a valid number, got NaN`)
    }
    return result
  }
  return value
}
