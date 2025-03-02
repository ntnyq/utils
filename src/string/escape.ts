/**
 * @copyright {@link https://github.com/sindresorhus/escape-string-regexp}
 */

export function escapeStringRegexp(value: string): string {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}
