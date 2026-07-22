const CHINESE_DIGITS = '零一二三四五六七八九'

/**
 * Replaces each ASCII digit with its Chinese numeral counterpart.
 * Non-digit characters are preserved.
 *
 * @param value - The number or string to convert.
 * @returns A string with each digit converted to a Chinese numeral.
 *
 * @example
 *
 * ```typescript
 * digitsToChinese(2026) // '二零二六'
 * digitsToChinese('020-1234') // '零二零-一二三四'
 * ```
 */
export function digitsToChinese(value: number | string): string {
  return String(value).replaceAll(/[0-9]/gu, digit =>
    CHINESE_DIGITS.charAt(Number(digit)),
  )
}
