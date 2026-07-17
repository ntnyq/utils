import { isString } from '../primitive'

export type UrlString = string & { readonly __brand: 'UrlString' }

/**
 * Checks whether a value is a valid URL string.
 * @param value - The value to test.
 * @returns True if the value is a valid absolute URL string.
 *
 * @example
 *
 * ```typescript
 * import { isUrlString } from '@ntnyq/utils'
 *
 * const result = isUrlString('https://example.com')
 * console.log(result) // => true
 * ```
 */
export function isUrlString(value: unknown): value is UrlString {
  if (!isString(value)) {
    return false
  }
  try {
    // eslint-disable-next-line no-new
    new URL(value)
    return true
  } catch {
    return false
  }
}
