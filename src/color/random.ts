import { randomNumber } from '../number'

/**
 * the maximum value of RGB
 */
const MAX_RGB = 255

/**
 * get a random RGB color
 * @returns a random RGB color
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
  return `rgb(${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)})`
}

/**
 * get a random RGBA color
 * @returns a random RGBA color
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
  return `rgba(${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${Math.random().toFixed(1)})`
}

/**
 * get a random hex color
 * @returns a random hex color
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
  return `#${Math.random().toString(16).slice(2, 8)}`
}
