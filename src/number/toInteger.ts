import {
  isEmptyString,
  isNaN,
  isNullOrUndefined,
  isNumber,
  isString,
  isUndefined,
} from '../predicate'

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
 * Converts a value to an integer using the provided conversion options.
 * @param value - The value to convert.
 * @param options - Options that control error handling, range limits, and decimal support.
 * @returns The converted integer result.
 *
 * @example
 *
 * ```typescript
 * import { toInteger } from '@ntnyq/utils'
 *
 * const result = toInteger('42')
 * console.log(result) // => 42
 * ```
 */
export function toInteger(
  value: unknown,
  options?: ToIntegerOptions & {
    onError?: 'useDefault' | 'throwError'
  },
): number

export function toInteger<T>(
  value: T,
  options: ToIntegerOptions | undefined,
): number | T

// oxlint-disable-next-line complexity
export function toInteger(
  value: unknown,
  options: ToIntegerOptions = {},
): unknown {
  const {
    defaultValue = 0,
    allowDecimal = false,
    allowNaN = false,
    onError = 'useDefault',
    min,
    max,
    outOfRange = 'clamp',
  } = options

  const handleError = (error: Error): unknown => {
    if (onError === 'throwError') {
      throw error
    }
    return onError === 'returnOriginal' ? value : defaultValue
  }

  let numberValue: number

  if (isNumber(value)) {
    numberValue = value
  } else if (isString(value)) {
    const trimmed = value.trim()

    if (isEmptyString(trimmed)) {
      return handleError(
        new TypeError('Cannot convert empty string to an integer'),
      )
    }

    numberValue = Number(trimmed)
  } else if (isNullOrUndefined(value)) {
    return handleError(new TypeError(`Cannot convert ${value} to an integer`))
  } else {
    try {
      numberValue = Number(value)
    } catch {
      return handleError(new TypeError('Cannot convert value to an integer'))
    }
  }

  if (isNaN(numberValue)) {
    if (allowNaN) {
      return numberValue
    }

    return handleError(new TypeError('Cannot convert NaN to an integer'))
  }

  if (!Number.isFinite(numberValue)) {
    return handleError(
      new TypeError('Cannot convert an infinite value to an integer'),
    )
  }

  let result: number
  if (allowDecimal) {
    result = Math.trunc(numberValue)
  } else {
    if (!Number.isInteger(numberValue)) {
      return handleError(new TypeError('Decimal values are not allowed'))
    }
    result = numberValue
  }

  if (!isUndefined(min) || !isUndefined(max)) {
    const minVal = Math.ceil(min ?? -Infinity)
    const maxVal = Math.floor(max ?? Infinity)

    if (minVal > maxVal) {
      throw new RangeError('Minimum value must not exceed maximum value')
    }

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
        result = Math.max(minVal, Math.min(maxVal, result))
      }
    }
  }

  return result
}
