export interface FormatDurationClockOptions {
  /**
   * Displays cumulative hours or cumulative minutes.
   * @default 'hours'
   */
  mode?: 'hours' | 'totalMinutes'
}

/**
 * Formats elapsed seconds as a clock, with cumulative hours or minutes.
 * Fractional seconds are rounded down. Negative and non-finite inputs use zero.
 *
 * @param seconds - Elapsed time in seconds.
 * @param options - Clock display mode.
 * @returns An `HH:mm:ss` or cumulative `mm:ss` string.
 *
 * @example
 * ```typescript
 * formatDurationClock(90_061) // '25:01:01'
 * formatDurationClock(3_661, { mode: 'totalMinutes' }) // '61:01'
 * ```
 */
export function formatDurationClock(
  seconds: number,
  options: FormatDurationClockOptions = {},
): string {
  const wholeSeconds = BigInt(
    Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0,
  )
  const minutes = wholeSeconds / 60n
  const parts =
    options.mode === 'totalMinutes' ? [minutes] : [minutes / 60n, minutes % 60n]
  parts.push(wholeSeconds % 60n)
  return parts.map(value => value.toString().padStart(2, '0')).join(':')
}
