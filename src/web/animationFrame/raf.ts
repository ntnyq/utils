/**
 * @file raf.ts
 */

import { isBrowser } from '../environment'

/**
 * Gets the global root object.
 * @returns the global root object
 * @example
 *
 * ```typescript
 * import { getRoot } from '@ntnyq/utils'
 *
 * const root = getRoot()
 * console.log(root === globalThis) // => true
 * ```
 *
 */
export function getRoot(): Window | typeof globalThis {
  return isBrowser() ? window : globalThis
}

/**
 * Request animation frame
 *
 * @param fn - callback
 * @returns id
 * @example
 *
 * ```typescript
 * import { rAF } from '@ntnyq/utils'
 *
 * const id = rAF(() => console.log('paint'))
 * console.log(typeof id) // => 'number'
 * ```
 *
 */
export function rAF(fn: FrameRequestCallback): number {
  const root = getRoot()
  const raf = root.requestAnimationFrame
  return raf.call(root, fn)
}

/**
 * Cancel animation frame
 *
 * @param id - id
 * @returns void
 * @example
 *
 * ```typescript
 * import { cAF } from '@ntnyq/utils'
 *
 * const id = requestAnimationFrame(() => {})
 * cAF(id)
 * ```
 *
 */
export function cAF(id: number): void {
  const root = getRoot()
  const caf = root.cancelAnimationFrame
  return caf.call(root, id)
}
