/**
 * Replaces all backslashes in a string with forward slashes.
 * @param input - The string to normalize.
 * @returns The normalized string using forward slashes.
 *
 * @example
 *
 * ```typescript
 * import { normalizePathSlashes } from '@ntnyq/utils'
 *
 * const result = normalizePathSlashes('foo\\bar\\baz')
 * console.log(result) // => 'foo/bar/baz'
 * ```
 */
export function normalizePathSlashes(input: string): string {
  return input.replaceAll('\\', '/')
}
