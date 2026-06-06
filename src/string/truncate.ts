export interface TruncateOptions {
  /**
   * Maximum output length.
   */
  maxLength: number

  /**
   * Truncation suffix.
   *
   * @default '...'
   */
  suffix?: string

  /**
   * Truncation position.
   *
   * @default 'end'
   */
  position?: 'end' | 'start' | 'middle'

  /**
   * Try to keep whole words for end and start truncation.
   *
   * @default false
   */
  preserveWords?: boolean
}

function trimByWordBoundary(input: string, position: 'start' | 'end'): string {
  if (!input.includes(' ')) {
    return input
  }

  if (position === 'end') {
    const candidate = input.replace(/\s+\S*$/u, '')
    return candidate || input
  }

  const candidate = input.replace(/^\S*\s+/u, '')
  return candidate || input
}

/**
 * Truncates text to a maximum length and appends/prepends a suffix.
 * @param input - Source string.
 * @param options - Truncation options.
 * @returns Truncated string.
 *
 * @example
 *
 * ```typescript
 * import { truncate } from '@ntnyq/utils'
 *
 * const result = truncate('The quick brown fox', { maxLength: 10 })
 * console.log(result) // => 'The qui...'
 * ```
 */
export function truncate(input: string, options: TruncateOptions): string {
  const {
    maxLength,
    suffix = '...',
    position = 'end',
    preserveWords = false,
  } = options

  if (maxLength <= 0) {
    return ''
  }

  if (input.length <= maxLength) {
    return input
  }

  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength)
  }

  const available = maxLength - suffix.length

  if (position === 'start') {
    let tail = input.slice(-available)
    if (preserveWords) {
      tail = trimByWordBoundary(tail, 'start')
    }
    return `${suffix}${tail}`
  }

  if (position === 'middle') {
    const leftLength = Math.ceil(available / 2)
    const rightLength = Math.floor(available / 2)
    return `${input.slice(0, leftLength)}${suffix}${input.slice(input.length - rightLength)}`
  }

  let head = input.slice(0, available)
  if (preserveWords) {
    head = trimByWordBoundary(head, 'end')
  }
  return `${head}${suffix}`
}
