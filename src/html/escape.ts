const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

const htmlEscapeRegexp = /[&<>'"]/gu

/**
 * Escapes HTML special characters in a string.
 * @param str - The string to escape.
 * @returns The escaped HTML string.
 *
 * @example
 *
 * ```typescript
 * import { escapeHTML } from '@ntnyq/utils'
 *
 * const result = escapeHTML('<div>Hello</div>')
 * console.log(result) // => '&lt;div&gt;Hello&lt;/div&gt;'
 * ```
 */
export function escapeHTML(str: string): string {
  return str.replace(
    htmlEscapeRegexp,
    char => htmlEscapeMap[char as keyof typeof htmlEscapeMap],
  )
}

const htmlUnescapeMap = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"',
}

// eslint-disable-next-line regexp/no-unused-capturing-group
const htmlUnescapeRegexp = /&(amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/gu

/**
 * Unescapes HTML entities in a string.
 * @param str - The HTML-escaped string.
 * @returns The unescaped string.
 *
 * @example
 *
 * ```typescript
 * import { unescapeHTML } from '@ntnyq/utils'
 *
 * const result = unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;')
 * console.log(result) // => '<div>Hello</div>'
 * ```
 */
export function unescapeHTML(str: string): string {
  return str.replace(
    htmlUnescapeRegexp,
    char => htmlUnescapeMap[char as keyof typeof htmlUnescapeMap],
  )
}
