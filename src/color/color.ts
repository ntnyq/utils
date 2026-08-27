import { createPadString } from '../string'

/**
 * Hex color
 */
const RE_VALID_HEX_COLOR = /^#(?:[0-9a-f]{6}|[0-9a-f]{3})$/iu

function validateHexColor(hex: string) {
  if (hex.length !== 4 && hex.length !== 7) {
    return false
  }
  if (!hex.startsWith('#')) {
    return false
  }
  return RE_VALID_HEX_COLOR.test(hex)
}

function normalizeHexString(hex: string) {
  return hex.length === 6 ? hex : hex.replaceAll(/./gu, '$&$&')
}

function normalizeChannel(value: number): number {
  if (Number.isNaN(value)) {
    return 0
  }
  return Math.min(255, Math.max(0, Math.round(value)))
}

function normalizeAlpha(value: number): number {
  if (Number.isNaN(value)) {
    return 0
  }
  return Math.min(1, Math.max(0, value))
}

export class Color {
  public red = 0
  public green = 0
  public blue = 0
  public alpha = 1

  /**
   * Creates a color with normalized RGB and alpha channels.
   *
   * @param red - Red channel value, clamped to the range from 0 to 255.
   * @param green - Green channel value, clamped to the range from 0 to 255.
   * @param blue - Blue channel value, clamped to the range from 0 to 255.
   * @param alpha - Alpha channel value, clamped to the range from 0 to 1.
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 1) {
    this.red = normalizeChannel(red)
    this.green = normalizeChannel(green)
    this.blue = normalizeChannel(blue)
    this.alpha = normalizeAlpha(alpha)
  }

  /**
   * Creates a color from RGB channel values.
   *
   * @param red - Red channel value.
   * @param green - Green channel value.
   * @param blue - Blue channel value.
   * @returns A color with full opacity.
   */
  static fromRGB(red: number, green: number, blue: number): Color {
    return new Color(red, green, blue)
  }

  /**
   * Creates a color from RGBA channel values.
   *
   * @param red - Red channel value.
   * @param green - Green channel value.
   * @param blue - Blue channel value.
   * @param alpha - Alpha channel value.
   * @returns A color with the given opacity.
   */
  static fromRGBA(
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ): Color {
    return new Color(red, green, blue, alpha)
  }

  /**
   * Creates a color from a `#RGB` or `#RRGGBB` hexadecimal string.
   *
   * @param hex - Hexadecimal color string.
   * @returns The parsed color with full opacity.
   * @throws {Error} If the string is not a supported hexadecimal color.
   */
  static fromHex(hex: string): Color {
    if (!validateHexColor(hex)) {
      throw new Error('Invalid hex color')
    }

    const [red, green, blue] = normalizeHexString(hex.slice(1))
      .match(/.{2}/gu)
      ?.map(value => Number.parseInt(value, 16)) ?? [0, 0, 0]
    return new Color(red, green, blue)
  }

  /**
   * Gets the perceived brightness on a scale from 0 to 255.
   *
   * @returns The weighted brightness of the RGB channels.
   */
  get brightness(): number {
    return (this.red * 299 + this.green * 587 + this.blue * 114) / 1000
  }

  /**
   * Gets whether the color is considered dark.
   *
   * @returns `true` when the perceived brightness is below 128.
   */
  get isDark(): boolean {
    return this.brightness < 128
  }

  /**
   * Gets whether the color is considered light.
   *
   * @returns `true` when the color is not considered dark.
   */
  get isLight(): boolean {
    return !this.isDark
  }

  /**
   * Formats the RGB channels as a hexadecimal color string.
   *
   * @param isUpperCase - Whether to use uppercase hexadecimal digits.
   * @returns The color in `#RRGGBB` format.
   */
  toHexString(isUpperCase = true): string {
    const pad2 = createPadString({ length: 2, char: '0' })
    const hexString = `#${pad2(this.red.toString(16))}${pad2(this.green.toString(16))}${pad2(this.blue.toString(16))}`
    return isUpperCase ? hexString.toUpperCase() : hexString
  }

  /**
   * Formats the color as an RGBA CSS color string.
   *
   * @returns The color in `rgba(red, green, blue, alpha)` format.
   */
  toRGBAString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
  }

  /**
   * add alpha value to {@link Color}
   *
   * @param alpha - alpha value
   * @returns instance of {@link Color}
   */
  withAlpha(alpha = 1): Color {
    return new Color(this.red, this.green, this.blue, alpha)
  }

  /**
   * lighten the color by percentage
   *
   * @param percentage - percentage to lighten
   */
  lighten(percentage = 0): Color {
    const amount = Math.round((percentage / 100) * 255)
    return new Color(
      Math.min(this.red + amount, 255),
      Math.min(this.green + amount, 255),
      Math.min(this.blue + amount, 255),
      this.alpha,
    )
  }

  /**
   * darken the color by percentage
   *
   * @param percentage - percentage to darken
   */
  darken(percentage = 0): Color {
    const amount = Math.round((percentage / 100) * 255)
    return new Color(
      Math.max(this.red - amount, 0),
      Math.max(this.green - amount, 0),
      Math.max(this.blue - amount, 0),
      this.alpha,
    )
  }
}
