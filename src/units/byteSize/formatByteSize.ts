import type { ToFixedOptions } from '../../number/toFixed'
import { STORAGE_UNITS } from './convert'

export interface FormatByteSizeOptions extends ToFixedOptions {
  /**
   * Text between the value and the unit label.
   * @default ' '
   */
  separator?: string

  /**
   * Uses short labels such as KB or IEC labels such as KiB.
   * Both styles scale by 1024.
   * @default 'short'
   */
  unitStyle?: 'short' | 'iec'
}

const BYTE_SIZE_LABELS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const

/**
 * Formats a byte count using the largest matching unit up to exabytes.
 *
 * @param bytes - A finite, non-negative number of bytes.
 * @param options - Precision, trailing zeros, separator, and unit label style.
 * @returns The scaled value and unit label.
 * @throws {RangeError} For invalid byte counts or precision outside 0–100.
 *
 * @example
 * ```typescript
 * formatByteSize(1_536) // '1.5 KB'
 * formatByteSize(1_024, { separator: '' }) // '1KB'
 * formatByteSize(1_024, { digits: 1, omitTrailingZeros: false, unitStyle: 'iec' }) // '1.0 KiB'
 * ```
 */
export function formatByteSize(
  bytes: number,
  options: FormatByteSizeOptions = {},
): string {
  const {
    digits = 2,
    omitTrailingZeros = true,
    separator = ' ',
    unitStyle = 'short',
  } = options

  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError('Byte size must be a non-negative finite number')
  }
  if (!Number.isInteger(digits) || digits < 0 || digits > 100) {
    throw new RangeError('digits must be an integer between 0 and 100')
  }

  let value = Math.abs(bytes)
  let unitIndex = 0
  while (value >= STORAGE_UNITS.KB && unitIndex < BYTE_SIZE_LABELS.length - 1) {
    value /= STORAGE_UNITS.KB
    unitIndex++
  }

  const unit = BYTE_SIZE_LABELS[unitIndex]!
  const label = unitStyle === 'iec' && unitIndex > 0 ? `${unit[0]}iB` : unit
  const formatted = value.toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: omitTrailingZeros ? 0 : digits,
    maximumFractionDigits: digits,
  })
  return `${formatted}${separator}${label}`
}
