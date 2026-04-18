/**
 * Cached warnings
 */
const warned = new Set<string>()

/**
 * Warn message only once
 *
 * @param message - warning message
 * @example
 *
 * ```typescript
 * import { warnOnce } from '@ntnyq/utils'
 *
 * warnOnce('Deprecated API')
 * warnOnce('Deprecated API') // only warns once
 * ```
 *
 */
export function warnOnce(message: string): void {
  if (warned.has(message)) {
    return
  }
  warned.add(message)
  // oxlint-disable-next-line no-console
  console.warn(message)
}
