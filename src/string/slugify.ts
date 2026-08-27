// eslint-disable-next-line no-control-regex
const rCombining = /[\u0300-\u036F]/gu
// oxlint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001F]/gu
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/gu

/**
 * Converts a string into a URL-friendly slug.
 * @param str - The string to convert.
 * @returns A normalized, lowercase slug string.
 *
 * @example
 *
 * ```typescript
 * import { slugify } from '@ntnyq/utils'
 *
 * const result = slugify('Hello, World!')
 * console.log(result) // => 'hello-world'
 * ```
 */
export function slugify(str: string): string {
  return (
    str
      .normalize('NFKD')
      // Remove accents
      .replace(rCombining, '')
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, '-')
      // Remove continuos separators
      .replaceAll(/-{2,}/gu, '-')
      // Remove prefixing and trailing separators
      .replaceAll(/^-+|-+$/gu, '')
      // ensure it doesn't start with a number (#121)
      .replace(/^\d/u, digit => `_${digit}`)
      // lowercase
      .toLowerCase()
  )
}
