/**
 * @copyright {@link https://github.com/sindresorhus/escape-string-regexp}
 */

export function escapeStringRegexp(value: string): string {
  return value
    .replaceAll(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replaceAll('-', '\\x2d')
}
