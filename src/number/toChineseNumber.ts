const CHINESE_DIGITS = '零一二三四五六七八九'
const CHINESE_GROUP_BASE = 10_000
const CHINESE_GROUP_UNITS = ['', '万', '亿', '万亿'] as const
const CHINESE_SMALL_UNITS = ['', '十', '百', '千'] as const
const CHINESE_SMALL_UNIT_POSITIONS = [...CHINESE_SMALL_UNITS.keys()].reverse()

function convertGroup(value: number): string {
  let needsZero = false
  let result = ''

  for (const position of CHINESE_SMALL_UNIT_POSITIONS) {
    const divisor = 10 ** position
    const digit = Math.floor(value / divisor) % 10

    if (digit === 0) {
      if (result && value % divisor !== 0) {
        needsZero = true
      }
    } else {
      if (needsZero) {
        result += '零'
      }

      result += CHINESE_DIGITS.charAt(digit) + CHINESE_SMALL_UNITS[position]!
      needsZero = false
    }
  }

  return result
}

/**
 * Converts a safe integer to its spoken Chinese numeral representation.
 *
 * @param value - The safe integer to convert.
 * @returns The Chinese numeral representation of the value.
 * @throws {TypeError} When `value` is not a safe integer.
 *
 * @example
 *
 * ```typescript
 * toChineseNumber(10) // '十'
 * toChineseNumber(1024) // '一千零二十四'
 * toChineseNumber(-2026) // '负二千零二十六'
 * ```
 */
export function toChineseNumber(value: number): string {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError('Expected a safe integer')
  }

  if (value === 0) {
    return '零'
  }

  const isNegative = value < 0
  let remainingValue = Math.abs(value)
  const groups: number[] = []

  while (remainingValue > 0) {
    groups.unshift(remainingValue % CHINESE_GROUP_BASE)
    remainingValue = Math.floor(remainingValue / CHINESE_GROUP_BASE)
  }

  let needsZero = false
  let result = ''

  for (const [index, group] of groups.entries()) {
    const groupPosition = groups.length - index - 1

    if (group === 0) {
      if (result) {
        needsZero = true
      }
    } else {
      if (result && (needsZero || group < CHINESE_GROUP_BASE / 10)) {
        result += '零'
      }

      result += convertGroup(group) + CHINESE_GROUP_UNITS[groupPosition]!
      needsZero = false
    }
  }

  result = result.replace(/^一十/u, '十')

  return isNegative ? `负${result}` : result
}
