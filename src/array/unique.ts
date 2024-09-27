/**
 * Returns a new array with unique values.
 * @param array - The array to process.
 * @returns The new array.
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Returns a new array with unique values.
 * @param array - The array to process.
 * @param equalFn - The function to compare values.
 * @returns The new array.
 */
export function uniqueBy<T>(array: T[], equalFn: (a: T, b: T) => boolean): T[] {
  return array.reduce<T[]>((acc, cur) => {
    const idx = acc.findIndex(item => equalFn(item, cur))
    if (idx === -1) {
      acc.push(cur)
    }
    return acc
  }, [])
}
