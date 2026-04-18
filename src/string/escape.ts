/**
 * Escapes special regular expression characters in a string.
 * @param value - The string to escape.
 * @returns A string that can be safely used inside a regular expression.
 *
 * @copyright {@link https://github.com/sindresorhus/escape-string-regexp}
 * @example
 *
 * ```typescript
 * import { escapeStringRegexp } from '@ntnyq/utils'
 *
 * const result = escapeStringRegexp('hello.world?')
 * console.log(result) // => 'hello\\.world\\?'
 * ```
 */
export function escapeStringRegexp(value: string): string {
  return value
    .replaceAll(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replaceAll('-', '\\x2d')
}
