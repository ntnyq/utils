/**
 * Check if element is in viewport
 * @param element - checked element
 * @param targetWindow - window
 * @returns true if element is in viewport, false otherwise
 * @example
 *
 * ```typescript
 * import { isElementVisibleInViewport } from '@ntnyq/utils'
 *
 * const element = document.getElementById('app')!
 * const result = isElementVisibleInViewport(element)
 * console.log(result) // => true
 * ```
 *
 */
export function isElementVisibleInViewport(
  element: HTMLElement,
  targetWindow: Window = window,
): boolean {
  const { top, left, bottom, right } = element.getBoundingClientRect()
  const { innerWidth, innerHeight } = targetWindow
  return (
    ((top >= 0 && top <= innerHeight) ||
      (bottom >= 0 && bottom <= innerHeight)) &&
    ((left >= 0 && left <= innerWidth) || (right >= 0 && right <= innerWidth))
  )
}
