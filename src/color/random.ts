import { randomInteger } from '../number'

const MAX_HEX_COLOR = 16_777_215
/**
 * the maximum value of RGB
 */
const MAX_RGB = 255

function randomRGBChannel(): number {
  return randomInteger(0, MAX_RGB, { includeMax: true })
}

/**
 * Gets a random RGB color with channels from 0 through 255.
 * @returns A random RGB color.
 * @example
 *
 * ```typescript
 * import { randomRGBColor } from '@ntnyq/utils'
 *
 * const color = randomRGBColor()
 * console.log(color) // => rgb(12, 34, 56)
 * ```
 *
 */
export function randomRGBColor() {
  return `rgb(${randomRGBChannel()}, ${randomRGBChannel()}, ${randomRGBChannel()})`
}

/**
 * Gets a random RGBA color with RGB channels from 0 through 255.
 * @returns A random RGBA color.
 * @example
 *
 * ```typescript
 * import { randomRGBAColor } from '@ntnyq/utils'
 *
 * const color = randomRGBAColor()
 * console.log(color) // => rgba(12, 34, 56, 0.5)
 * ```
 *
 */
export function randomRGBAColor() {
  return `rgba(${randomRGBChannel()}, ${randomRGBChannel()}, ${randomRGBChannel()}, ${Math.random().toFixed(1)})`
}

/**
 * Gets a six-digit random hexadecimal color.
 * @returns A random hexadecimal color from #000000 through #ffffff.
 * @example
 *
 * ```typescript
 * import { randomHexColor } from '@ntnyq/utils'
 *
 * const color = randomHexColor()
 * console.log(color) // => #a1b2c3
 * ```
 *
 */
export function randomHexColor() {
  const value = randomInteger(0, MAX_HEX_COLOR, { includeMax: true })
  return `#${value.toString(16).padStart(6, '0')}`
}
