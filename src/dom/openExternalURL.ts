import type { LiteralUnion } from '../types'

export interface OpenExternalURLOptions {
  /**
   * open target
   *
   * @default `_blank`
   */
  target?: LiteralUnion<'_self' | '_top' | '_blank' | '_parent'>
}

/**
 * Open external url
 * @param url - URL to open
 * @param options - open options
 * @returns window proxy
 */
export function openExternalURL(
  url: string | URL,
  options: OpenExternalURLOptions = {},
): WindowProxy | null {
  const { target = '_blank' } = options
  const proxy = window.open(url, target)
  return proxy
}
