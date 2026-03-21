import { isNaN, isNumber, isString } from '../is'

/**
 * Converts `value` to a number.
 * @param value The value to process.
 * @returns Returns the number.
 */
export function toNumber(value: string | number): number {
  if (!isString(value) && !isNumber(value)) {
    throw new TypeError(`Expected a string or number, got ${typeof value}`)
  }
  if (isNaN(value)) {
    throw new TypeError(`Expected a valid number, got NaN`)
  }
  if (isString(value)) {
    const result = Number.parseFloat(value)
    if (isNaN(result)) {
      throw new TypeError(`Expected a valid number, got NaN`)
    }
    return result
  }
  return value
}
