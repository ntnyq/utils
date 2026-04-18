// oxlint-disable unicorn/prefer-add-event-listener

import { isBlob, isString } from '../is'

export interface ImageSize {
  width: number
  height: number
}

export interface GetImageNaturalSizeOptions {
  /**
   * Timeout in milliseconds to wait for the image to load before rejecting the promise.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number
  /**
   * The decoding mode for the image. Setting this to 'async' allows the browser to decode the image asynchronously, which can improve performance and reduce blocking of the main thread.
   *
   * - 'sync': The image will be decoded synchronously, which may block the main thread until decoding is complete.
   * - 'async': The image will be decoded asynchronously, allowing the main thread to remain responsive.
   * - 'auto': The browser will choose the decoding mode based on heuristics.
   *
   * @default 'async'
   */
  decoding?: 'sync' | 'async' | 'auto'
  /**
   * The cross-origin attribute for the image. This is necessary if the image is hosted on a different origin and you want to access its properties (like naturalWidth and naturalHeight) without tainting the canvas.
   *
   * - 'anonymous': The image will be fetched without credentials (cookies, HTTP authentication, and client-side SSL certificates).
   * - 'use-credentials': The image will be fetched with credentials.
   * - null: No cross-origin requests will be made, and the image will be treated as same-origin.
   *
   * @default 'anonymous'
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | null
  /**
   * Whether to cache the image or not. If set to false, a unique query parameter will be appended to the image URL to prevent caching. This can be useful for ensuring that you get the most up-to-date image, but it may increase load times and bandwidth usage.
   *
   * @default true
   */
  cache?: boolean
}

const getImageSizeCache = new Map<string, Promise<ImageSize>>()

/**
 * Gets the natural width and height of an image source.
 * @param source - The image URL, Blob, or File to inspect.
 * @param options - Options for timeout, decoding, cross-origin mode, and caching.
 * @returns A promise that resolves with the image's natural size.
 *
 * @example
 *
 * ```typescript
 * import { getImageNaturalSize } from '@ntnyq/utils'
 *
 * const size = await getImageNaturalSize('/logo.png')
 * console.log(size.width, size.height) // => natural image size
 * ```
 */
export async function getImageNaturalSize(
  source: string | Blob | File,
  options: GetImageNaturalSizeOptions = {},
): Promise<ImageSize> {
  const {
    timeout = 30_000,
    crossOrigin = 'anonymous',
    cache = true,
    decoding = 'async',
  } = options

  const cacheKey = isString(source) ? source : URL.createObjectURL(source)

  if (cache && getImageSizeCache.has(cacheKey)) {
    return getImageSizeCache.get(cacheKey)!
  }

  const promise = new Promise<ImageSize>((resolve, reject) => {
    const img = new Image()
    let isSettled = false

    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(`Failed to load image: ${cacheKey} within ${timeout}ms`))
    }, timeout)

    function cleanup() {
      clearTimeout(timer)

      isSettled = true
      img.onload = null
      img.onerror = null
      img.onabort = null
      img.src = ''

      if (isBlob(source)) {
        URL.revokeObjectURL(cacheKey)
      }
    }

    img.onload = () => {
      if (isSettled) {
        return
      }
      const size = { width: img.naturalWidth, height: img.naturalHeight }

      cleanup()
      resolve(size)
    }

    img.onerror = () => {
      cleanup()
      reject(new Error(`Failed to load image: ${cacheKey}`))
    }

    img.onabort = () => {
      cleanup()
      reject(new Error(`Image loading aborted: ${cacheKey}`))
    }

    img.decoding = decoding
    img.src = cacheKey

    if (crossOrigin) {
      img.crossOrigin = crossOrigin
    }
  })

  if (cache) {
    getImageSizeCache.set(cacheKey, promise)
  }

  return promise
}
