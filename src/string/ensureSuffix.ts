/**
 * Ensures that a string ends with the specified suffix.
 * @param input - The input string to process.
 * @param suffix - The suffix to append when it is missing.
 * @returns The original string or a new string with the suffix added.
 *
 * @example
 *
 * ```typescript
 * import { ensureSuffix } from '@ntnyq/utils'
 *
 * const result = ensureSuffix('file', '.txt')
 * console.log(result) // => 'file.txt'
 * ```
 */
export function ensureSuffix(input: string, suffix: string): string {
  return input.endsWith(suffix) ? input : `${input}${suffix}`
}
