/**
 * Cached warnings
 */
const warned = new Set<string>()

/**
 * Warn message only once
 *
 * @param message - warning message
 */
export function warnOnce(message: string): void {
  if (warned.has(message)) {
    return
  }
  warned.add(message)
  console.warn(message)
}
