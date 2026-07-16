import type { LiteralUnion } from '../types'

export interface OpenExternalURLOptions {
  /**
   * open target
   *
   * @default `_blank`
   */
  target?: LiteralUnion<'_self' | '_top' | '_blank' | '_parent'>

  /**
   * URL protocols that may be opened.
   *
   * @default ['http:', 'https:']
   */
  allowedProtocols?: readonly string[]
}

/**
 * Open external url
 * @param url - URL to open
 * @param options - open options
 * @returns window proxy
 * @example
 *
 * ```typescript
 * import { openExternalURL } from '@ntnyq/utils'
 *
 * openExternalURL('https://github.com', { target: '_blank' })
 * ```
 *
 */
export function openExternalURL(
  url: string | URL,
  options: OpenExternalURLOptions = {},
): WindowProxy | null {
  const { target = '_blank', allowedProtocols = ['http:', 'https:'] } = options
  const parsedURL =
    url instanceof URL
      ? url
      : new URL(url, window.location?.href ?? 'http://localhost')
  const normalizedProtocols = allowedProtocols.map(protocol =>
    protocol.endsWith(':') ? protocol : `${protocol}:`,
  )

  if (!normalizedProtocols.includes(parsedURL.protocol)) {
    throw new TypeError(`URL protocol is not allowed: ${parsedURL.protocol}`)
  }

  const opensNewContext =
    target === '_blank' ||
    !['_self', '_top', '_parent'].includes(target.toLowerCase())
  const proxy = window.open(
    parsedURL,
    target,
    opensNewContext ? 'noopener,noreferrer' : undefined,
  )
  return proxy
}
