/**
 * @file is/dom.ts
 */

import { isBrowser } from '../env'

/**
 * Check if given value is an HTMLElement
 * @param value - The value to check
 * @returns True if the value is an HTMLElement, false otherwise
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  // ensure DOM is available
  if (!isBrowser()) {
    return false
  }

  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    (value as Node).nodeType === Node.ELEMENT_NODE &&
    value instanceof HTMLElement
  )
}
