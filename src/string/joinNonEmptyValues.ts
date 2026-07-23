type JoinableValue = string | number | null | undefined

export interface JoinNonEmptyValuesOptions {
  /**
   * @default ''
   */
  separator?: string
}

/**
 * Joins non-empty strings and numbers into a single string.
 * @param array - An array of strings or numbers.
 * @param options - An object of options.
 * @returns A string.
 * @example
 *
 * ```typescript
 * import { joinNonEmptyValues } from '@ntnyq/utils'
 *
 * const result = joinNonEmptyValues(['hello', '', 'world'], {
 *   separator: ' ',
 * })
 * console.log(result) // => 'hello world'
 * ```
 *
 */
export function joinNonEmptyValues(
  array: readonly JoinableValue[],
  options: JoinNonEmptyValuesOptions = {},
): string {
  const { separator = '' } = options
  if (!Array.isArray(array) || !array.length) {
    return ''
  }
  return array.filter(i => Boolean(i) || i === 0).join(separator)
}

/**
 * Joins non-empty strings and numbers into a single string.
 * @deprecated Use {@link joinNonEmptyValues} instead.
 */
export function join(
  array: readonly JoinableValue[],
  options: JoinNonEmptyValuesOptions = {},
): string {
  return joinNonEmptyValues(array, options)
}
