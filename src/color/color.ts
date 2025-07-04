import { createPadString } from '../string'

const RE_VALID_HEX_COLOR = /^#(?:[0-9a-f]{6}|[0-9a-f]{3})$/i

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
  return hex.length === 6 ? hex : hex.replace(/./g, '$&$&')
}

export class Color {
  public red: number = 0
  public green: number = 0
  public blue: number = 0
  public alpha: number = 1

  constructor(
    red: number = 0,
    green: number = 0,
    blue: number = 0,
    alpha: number = 1,
  ) {
    this.red = red
    this.green = green
    this.blue = blue
    this.alpha = alpha
  }

  static fromRGB(red: number, green: number, blue: number): Color {
    return new Color(red, green, blue)
  }

  static fromRGBA(
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ): Color {
    return new Color(red, green, blue, alpha)
  }

  static fromHex(hex: string): Color {
    if (!validateHexColor(hex)) {
      throw new Error('Invalid hex color')
    }

    const [red, green, blue] = normalizeHexString(hex.slice(1))
      .match(/.{2}/g)
      ?.map(value => Number.parseInt(value, 16)) ?? [0, 0, 0]
    return new Color(red, green, blue)
  }

  get brightness(): number {
    return (this.red * 299 + this.green * 587 + this.blue * 114) / 1000
  }

  get isDark(): boolean {
    return this.brightness < 128
  }

  get isLight(): boolean {
    return !this.isDark
  }

  toHexString(isUpperCase = true): string {
    const pad2 = createPadString({ length: 2, char: '0' })
    const hexString = `#${pad2(this.red.toString(16))}${pad2(this.green.toString(16))}${pad2(this.blue.toString(16))}`
    return isUpperCase ? hexString.toUpperCase() : hexString
  }

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
