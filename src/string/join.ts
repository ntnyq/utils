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
 * @example
 *
 * ```typescript
 * import { join } from '@ntnyq/utils'
 *
 * const result = join(['hello', '', 'world'], { separator: ' ' })
 * console.log(result) // => 'hello world'
 * ```
 *
 */
export function join(
  array: JoinableValue[],
  options: JoinOptions = {},
): string {
  const { separator = '' } = options
  if (!Array.isArray(array) || !array.length) {
    return ''
  }
  return array.filter(i => Boolean(i) || i === 0).join(separator)
}
