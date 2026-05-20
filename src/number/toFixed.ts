export interface ToFixedOptions {
  /**
   * The number of digits to appear after the decimal point.
   * @default 2
   */
  digits?: number
  /**
   * Whether to omit trailing zeros after the decimal point.
   * @default true
   */
  omitTrailingZeros?: boolean
}

/**
 * Formats a number using fixed-point notation.
 * @param num - The number to format.
 * @param options - An object containing formatting options.
 * @returns A string representing the formatted number.
 *
 * @example
 *
 * ```typescript
 * toFixed(123.456) // '123.46'
 * toFixed(123.456, { digits: 1 }) // '123.5'
 * toFixed(123.400, { omitTrailingZeros: false }) // '123.40'
 * toFixed(123.400, { digits: 3, omitTrailingZeros: false }) // '123.400'
 * toFixed(123.400, { digits: 3 }) // '123.4'
 * toFixed(123.000) // '123'
 * ```
 */
export function toFixed(num: number, options: ToFixedOptions = {}): string {
  const { digits = 2, omitTrailingZeros = true } = options
  const fixed = (Math.round(num * 10 ** digits) / 10 ** digits).toFixed(digits)
  return omitTrailingZeros ? fixed.replace(/\.?0+$/u, '') : fixed
}
