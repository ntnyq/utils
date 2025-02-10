import { randomNumber } from '../number'

/**
 * the maximum value of RGB
 */
const MAX_RGB = 255

/**
 * get a random RGB color
 * @returns a random RGB color
 */
export function randomRGBColor() {
  return `rgb(${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)})`
}

/**
 * get a random RGBA color
 * @returns a random RGBA color
 */
export function randomRGBAColor() {
  return `rgba(${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${randomNumber(MAX_RGB)}, ${Math.random().toFixed(1)})`
}

/**
 * get a random hex color
 * @returns a random hex color
 */
export function randomHexColor() {
  return `#${Math.random().toString(16).slice(2, 8)}`
}
