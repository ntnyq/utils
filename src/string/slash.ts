/**
 * Replaces all backslashes in a string with forward slashes.
 * @param input - The string to normalize.
 * @returns The normalized string using forward slashes.
 *
 * @example
 *
 * ```typescript
 * import { slash } from '@ntnyq/utils'
 *
 * const result = slash('foo\\bar\\baz')
 * console.log(result) // => 'foo/bar/baz'
 * ```
 */
export function slash(input: string): string {
  return input.replaceAll('\\', '/')
}
