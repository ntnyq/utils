/**
 * Ensures that a string starts with the specified prefix.
 * @param input - The input string to process.
 * @param prefix - The prefix to prepend when it is missing.
 * @returns The original string or a new string with the prefix added.
 *
 * @example
 *
 * ```typescript
 * import { ensurePrefix } from '@ntnyq/utils'
 *
 * const result = ensurePrefix('world', 'hello ')
 * console.log(result) // => 'hello world'
 * ```
 */
export function ensurePrefix(input: string, prefix: string): string {
  return input.startsWith(prefix) ? input : `${prefix}${input}`
}
