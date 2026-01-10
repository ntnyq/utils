/**
 * Checks if the code is running in a browser
 *
 * @returns true if the code is running in a browser
 */
export function isBrowser(): boolean {
  return (
    typeof document !== 'undefined'
    && typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && window === self
  )
}
