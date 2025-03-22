interface Options extends ScrollIntoViewOptions {
  /**
   * @default `document.body`
   */
  parent?: HTMLElement
}

/**
 * Scroll element into view if it is out of view.
 *
 * @param element - element to scroll
 * @param options - scroll options
 */
export function scrollElementIntoView(
  element: HTMLElement,
  options: Options = {},
): void {
  const body = document.body
  const { parent = body, ...scrollIntoViewOptions } = options

  if (parent === body) {
    parent.scrollIntoView(scrollIntoViewOptions)
    return
  }

  const parentRect = parent.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const isHorizontal = parent.scrollWidth > parent.scrollHeight
  const isOutOfView = isHorizontal
    ? elementRect.left < parentRect.left || elementRect.right > parentRect.right
    : elementRect.top < parentRect.top || elementRect.bottom > parentRect.bottom

  if (isOutOfView) {
    parent.scrollIntoView(scrollIntoViewOptions)
  }
}
