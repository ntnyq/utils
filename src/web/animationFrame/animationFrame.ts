/**
 * @file animationFrame.ts
 */

import { isBrowser } from '../environment'

/**
 * Gets the active global root object.
 * @returns the global root object
 * @example
 *
 * ```typescript
 * import { getGlobalRoot } from '@ntnyq/utils'
 *
 * const root = getGlobalRoot()
 * console.log(root === globalThis) // => true
 * ```
 *
 */
export function getGlobalRoot(): Window | typeof globalThis {
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
 * import { requestFrame } from '@ntnyq/utils'
 *
 * const id = requestFrame(() => console.log('paint'))
 * console.log(typeof id) // => 'number'
 * ```
 *
 */
export function requestFrame(fn: FrameRequestCallback): number {
  const root = getGlobalRoot()
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
 * import { cancelFrame } from '@ntnyq/utils'
 *
 * const id = requestAnimationFrame(() => {})
 * cancelFrame(id)
 * ```
 *
 */
export function cancelFrame(id: number): void {
  const root = getGlobalRoot()
  const caf = root.cancelAnimationFrame
  return caf.call(root, id)
}
