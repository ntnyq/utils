/**
 * Checks if the code is running in a browser
 *
 * @returns true if the code is running in a browser
 * @example
 *
 * ```typescript
 * import { isBrowser } from '@ntnyq/utils'
 *
 * const result = isBrowser()
 * console.log(result) // => true
 * ```
 *
 */
export function isBrowser(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    window === self
  )
}
