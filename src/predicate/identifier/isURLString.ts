import { isString } from '../primitive'

export type URLString = string & { readonly __brand: 'URLString' }

/**
 * Checks whether a value is a valid URL string.
 * @param value - The value to test.
 * @returns True if the value is a valid absolute URL string.
 *
 * @example
 *
 * ```typescript
 * import { isURLString } from '@ntnyq/utils'
 *
 * const result = isURLString('https://example.com')
 * console.log(result) // => true
 * ```
 */
export function isURLString(value: unknown): value is URLString {
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
