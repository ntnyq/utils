/**
 * Wait for a number of milliseconds
 *
 * @param ms millseconds to wait
 * @returns a promise that resolves after ms milliseconds
 *
 * @example
 * ```
 * import { waitFor } from '@ntnyq/utils'
 * await waitFor(3e3)
 * // do somthing after 3 seconds
 * ```
 */

export function waitFor(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
