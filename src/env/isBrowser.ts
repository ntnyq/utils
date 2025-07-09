/**
 * @file env.ts
 */

/**
 * Checks if the code is running in a browser
 *
 * @returns boolean - true if the code is running in a browser
 */
export function isBrowser(): boolean {
  return typeof document !== 'undefined'
}
