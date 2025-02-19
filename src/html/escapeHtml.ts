const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

const htmlEscapeRegexp = /[&<>'"]/g

/**
 * Escape html chars
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
const htmlUnescapeRegexp = /&(amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g

/**
 * Unescape html chars
 */
export function unescapeHTML(str: string): string {
  return str.replace(
    htmlUnescapeRegexp,
    char => htmlUnescapeMap[char as keyof typeof htmlUnescapeMap],
  )
}
