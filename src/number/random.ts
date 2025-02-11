export interface RamdomNumberOptions {
  /**
   * include max value
   *
   * @default false
   */
  includeMax?: boolean
}

/**
 * random an integer by given range
 *
 * @param min - min value
 * @param max - max value
 * @returns random integer in range
 */
export function randomNumber(
  min: number,
  max = 0,
  options: RamdomNumberOptions = {},
) {
  if (max === 0) {
    max = min
    min = 0
  }
  if (min > max) {
    ;[min, max] = [max, min]
  }

  return Math.trunc(
    Math.random() * (max - min + (options.includeMax ? 1 : 0)) + min,
  )
}
