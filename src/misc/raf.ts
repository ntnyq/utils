/**
 * @file raf.ts
 */

import { isBrowser } from '../env'

const root = isBrowser() ? window : globalThis

let prev = Date.now()

function mockRAF(fn: FrameRequestCallback): number {
  const curr = Date.now()
  const ms = Math.max(0, 16 - (curr - prev))
  const id = setTimeout(fn, ms)
  prev = curr + ms
  return id
}

/**
 * Request animation frame
 *
 * @param fn callback
 * @returns id
 */
export function rAF(fn: FrameRequestCallback) {
  const raf = root.requestAnimationFrame || mockRAF
  return raf.call(root, fn)
}

/**
 * Cancel animation frame
 *
 * @param id id
 * @returns void
 */
export function cAF(id: number) {
  const caf = root.cancelAnimationFrame || root.clearTimeout
  return caf.call(root, id)
}
