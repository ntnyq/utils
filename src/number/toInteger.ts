import {
  isEmptyString,
  isNaN,
  isNullOrUndefined,
  isNumber,
  isString,
  isUndefined,
} from '../is'

export interface ToIntegerOptions {
  /**
   * The number to convert to an integer.
   *
   * @default 0
   */
  defaultValue?: number

  /**
   * @default false
   */
  allowDecimal?: boolean

  /**
   * @default false
   */
  allowNaN?: boolean

  /**
   * @default `useDefault`
   */
  onError?: 'useDefault' | 'throwError' | 'returnOriginal'

  /**
   * Minimum value of the number. included
   */
  min?: number

  /**
   * Maximum value of the number. included
   */
  max?: number

  /**
   * @default `clamp`
   */
  outOfRange?: 'clamp' | 'useDefault' | 'throwError'
}

/**
 * Transforms a value to an integer.
 * @param value - The value to convert to an integer.
 * @param options - Options for the conversion.
 * @returns The converted integer.
 */
export function toInteger(
  value: unknown,
  options: ToIntegerOptions = {},
): number {
  const {
    defaultValue = 0,
    allowDecimal = false,
    allowNaN = false,
    onError = 'useDefault',
    min,
    max,
    outOfRange = 'clamp',
  } = options

  let numberValue: number
  let result: number

  if (isNumber(value)) {
    numberValue = value
  } else if (isString(value)) {
    const trimmed = value.trim()

    if (isEmptyString(trimmed)) {
      if (onError === 'throwError') {
        throw new TypeError('Cannot convert empty string to an integer')
      }
      return onError === 'returnOriginal'
        ? (value as unknown as number)
        : defaultValue
    }

    numberValue = Number(trimmed)
  } else if (isNullOrUndefined(value)) {
    if (onError === 'throwError') {
      throw new TypeError(`Cannot convert ${value} to an integer`)
    }
    return onError === 'useDefault'
      ? (value as unknown as number)
      : defaultValue
  } else {
    numberValue = Number(value)
  }

  if (isNaN(numberValue)) {
    if (allowNaN) {
      return numberValue
    }

    if (onError === 'throwError') {
      throw new TypeError(`Cannot convert NaN to an integer`)
    }
    return onError === 'returnOriginal'
      ? (value as unknown as number)
      : defaultValue
  }

  if (allowDecimal) {
    result = numberValue > 0 ? Math.floor(numberValue) : Math.ceil(numberValue)
  } else {
    if (numberValue % 1 !== 0) {
      if (onError === 'throwError') {
        throw new Error('Decimal values are not allowed')
      }
      return onError === 'returnOriginal'
        ? (value as unknown as number)
        : defaultValue
    }
    result = numberValue
  }

  if (!isUndefined(min) || !isUndefined(max)) {
    const minVal = min ?? -Infinity
    const maxVal = max ?? Infinity

    if (result < minVal || result > maxVal) {
      if (outOfRange === 'throwError') {
        throw new RangeError(
          `Value ${result} is out of range [${minVal}, ${maxVal}]`,
        )
      }

      if (outOfRange === 'useDefault') {
        return defaultValue
      }

      if (outOfRange === 'clamp') {
        result = Math.max(minVal, Math.min(maxVal, numberValue))
      }
    }
  }

  return result
}
