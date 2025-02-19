/**
 * Scroll element into view if it is out of view.
 *
 * @param element - element to scroll
 * @param parent - parent element
 * @param options - scroll options
 */
export function scrollIntoView(
  element: HTMLElement,
  parent: HTMLElement,
  options: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  },
): void {
  if (parent === document.body) {
    parent.scrollIntoView(options)
    return
  }
  const parentRect = parent.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const isHorizontal = parent.scrollWidth > parent.scrollHeight
  const isOutOfView = isHorizontal
    ? elementRect.left < parentRect.left || elementRect.right > parentRect.right
    : elementRect.top < parentRect.top || elementRect.bottom > parentRect.bottom

  if (isOutOfView) {
    parent.scrollIntoView(options)
  }
}
