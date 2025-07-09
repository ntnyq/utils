/**
 * @file raf.ts
 */

import { isBrowser } from '../env'

/**
 * Gets the global root object.
 * @returns the global root object
 */
export function getRoot(): Window | typeof globalThis {
  return isBrowser() ? window : globalThis
}

/**
 * Request animation frame
 *
 * @param fn - callback
 * @returns id
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
 */
export function cAF(id: number): void {
  const root = getRoot()
  const caf = root.cancelAnimationFrame
  return caf.call(root, id)
}
