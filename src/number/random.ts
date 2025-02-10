/**
 * random an integer by given range
 *
 * @param min - min value
 * @param max - max value
 * @returns random integer in range
 */
export function randomNumber(min: number, max = 0) {
  if (max === 0) {
    max = min
    min = 0
  }
  if (min > max) {
    ;[min, max] = [max, min]
  }

  return Math.trunc(Math.random() * (max - min + 1) + min)
}
