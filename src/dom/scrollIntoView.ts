export interface ScrollElementIntoViewOptions extends ScrollIntoViewOptions {
  /**
   * @default `document.body`
   */
  parent?: HTMLElement
}

/**
 * Scrolls an element into view when it is outside the visible area.
 * @param element - The target element to reveal.
 * @param options - Scrolling behavior and parent container options.
 * @returns Nothing.
 *
 * @example
 *
 * ```typescript
 * import { scrollElementIntoView } from '@ntnyq/utils'
 *
 * const element = document.getElementById('target')!
 * scrollElementIntoView(element, { behavior: 'smooth' })
 * ```
 */
export function scrollElementIntoView(
  element: HTMLElement,
  options: ScrollElementIntoViewOptions = {},
): void {
  const body = document.body
  const { parent = body, ...scrollIntoViewOptions } = options

  if (parent === body) {
    element.scrollIntoView(scrollIntoViewOptions)
    return
  }

  const parentRect = parent.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const isHorizontal = parent.scrollWidth > parent.scrollHeight
  const isOutOfView = isHorizontal
    ? elementRect.left < parentRect.left || elementRect.right > parentRect.right
    : elementRect.top < parentRect.top || elementRect.bottom > parentRect.bottom

  if (isOutOfView) {
    element.scrollIntoView(scrollIntoViewOptions)
  }
}
