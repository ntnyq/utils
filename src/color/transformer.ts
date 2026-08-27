import { Color } from './color'

const MAX_COLOR_CHANNEL = 255
const MAX_PERCENTAGE = 100

export interface RGBColor {
  /**
   * Red channel from 0 through 255.
   */
  red: number

  /**
   * Green channel from 0 through 255.
   */
  green: number

  /**
   * Blue channel from 0 through 255.
   */
  blue: number
}

function normalizePercentage(percentage: number): number {
  if (!Number.isFinite(percentage)) {
    throw new RangeError('Color percentage must be finite')
  }
  return Math.min(MAX_PERCENTAGE, Math.max(0, percentage))
}

/**
 * Converts a hexadecimal color to RGB channels.
 *
 * @param hex - A `#RGB` or `#RRGGBB` hexadecimal color.
 * @returns The normalized red, green, and blue channels.
 * @throws {Error} If the hexadecimal color is invalid.
 *
 * @example
 *
 * ```typescript
 * import { hexToRGB } from '@ntnyq/utils'
 *
 * hexToRGB('#369') // => { red: 51, green: 102, blue: 153 }
 * ```
 */
export function hexToRGB(hex: string): RGBColor {
  const { red, green, blue } = Color.fromHex(hex)
  return { red, green, blue }
}

/**
 * Converts a hexadecimal color to a CSS RGB color string.
 *
 * @param hex - A `#RGB` or `#RRGGBB` hexadecimal color.
 * @returns The color in `rgb(red, green, blue)` format.
 * @throws {Error} If the hexadecimal color is invalid.
 *
 * @example
 *
 * ```typescript
 * import { hexToRGBString } from '@ntnyq/utils'
 *
 * hexToRGBString('#369') // => 'rgb(51, 102, 153)'
 * ```
 */
export function hexToRGBString(hex: string): string {
  const { red, green, blue } = hexToRGB(hex)
  return `rgb(${red}, ${green}, ${blue})`
}

/**
 * Converts RGB channels to a hexadecimal color.
 *
 * Channel values are rounded and clamped to the range from 0 through 255.
 *
 * @param color - The red, green, and blue channels.
 * @param isUpperCase - Whether to use uppercase hexadecimal digits.
 * @returns The color in `#RRGGBB` format.
 *
 * @example
 *
 * ```typescript
 * import { rgbToHex } from '@ntnyq/utils'
 *
 * rgbToHex({ red: 51, green: 102, blue: 153 }) // => '#336699'
 * ```
 */
export function rgbToHex(color: RGBColor, isUpperCase = true): string {
  return Color.fromRGB(color.red, color.green, color.blue).toHexString(
    isUpperCase,
  )
}

/**
 * Lightens a hexadecimal color by adding a percentage of the RGB range to
 * each channel.
 *
 * @param hex - A `#RGB` or `#RRGGBB` hexadecimal color.
 * @param percentage - Percentage from 0 through 100. Out-of-range values are clamped.
 * @param isUpperCase - Whether to use uppercase hexadecimal digits.
 * @returns The lightened color in `#RRGGBB` format.
 *
 * @example
 *
 * ```typescript
 * import { lightenHexColor } from '@ntnyq/utils'
 *
 * lightenHexColor('#336699', 20) // => '#6699CC'
 * ```
 */
export function lightenHexColor(
  hex: string,
  percentage = 0,
  isUpperCase = true,
): string {
  return Color.fromHex(hex)
    .lighten(normalizePercentage(percentage))
    .toHexString(isUpperCase)
}

/**
 * Darkens a hexadecimal color by subtracting a percentage of the RGB range
 * from each channel.
 *
 * @param hex - A `#RGB` or `#RRGGBB` hexadecimal color.
 * @param percentage - Percentage from 0 through 100. Out-of-range values are clamped.
 * @param isUpperCase - Whether to use uppercase hexadecimal digits.
 * @returns The darkened color in `#RRGGBB` format.
 *
 * @example
 *
 * ```typescript
 * import { darkenHexColor } from '@ntnyq/utils'
 *
 * darkenHexColor('#336699', 20) // => '#003366'
 * ```
 */
export function darkenHexColor(
  hex: string,
  percentage = 0,
  isUpperCase = true,
): string {
  return Color.fromHex(hex)
    .darken(normalizePercentage(percentage))
    .toHexString(isUpperCase)
}

/**
 * Inverts every RGB channel of a hexadecimal color.
 *
 * @param hex - A `#RGB` or `#RRGGBB` hexadecimal color.
 * @param isUpperCase - Whether to use uppercase hexadecimal digits.
 * @returns The inverted color in `#RRGGBB` format.
 *
 * @example
 *
 * ```typescript
 * import { invertHexColor } from '@ntnyq/utils'
 *
 * invertHexColor('#123456') // => '#EDCBA9'
 * ```
 */
export function invertHexColor(hex: string, isUpperCase = true): string {
  const color = hexToRGB(hex)
  return rgbToHex(
    {
      red: MAX_COLOR_CHANNEL - color.red,
      green: MAX_COLOR_CHANNEL - color.green,
      blue: MAX_COLOR_CHANNEL - color.blue,
    },
    isUpperCase,
  )
}
