type JoinableValue = string | number | null | undefined

interface JoinOptions {
  /**
   * @default ''
   */
  separator?: string
}

/**
 * Joins an array of strings or numbers into a single string.
 * @param array - An array of strings or numbers.
 * @param options - An object of options.
 * @returns A string.
 */
export function join(
  array: JoinableValue[],
  options: JoinOptions = {},
): string {
  const { separator = '' } = options
  if (!Array.isArray(array) || !array.length) {
    return ''
  }
  return array.filter(v => Boolean(v) || v === 0).join(separator)
}
