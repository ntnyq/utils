// oxlint-disable unicorn/prefer-add-event-listener

import { isString } from '../../predicate'

export interface ImageSize {
  width: number
  height: number
}

export interface LoadImageDimensionsOptions {
  /**
   * Timeout in milliseconds to wait for the image to load.
   *
   * @default 30000
   */
  timeout?: number
  /**
   * Browser image decoding mode.
   *
   * @default 'async'
   */
  decoding?: 'sync' | 'async' | 'auto'
  /**
   * Cross-origin mode assigned before the image source begins loading.
   *
   * @default 'anonymous'
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | null
  /**
   * Whether to reuse successful loads. Disabled string loads receive a unique
   * cache-busting query parameter.
   *
   * @default true
   */
  cache?: boolean
}

const MAX_STRING_CACHE_SIZE = 100
const MAX_BLOB_OPTION_CACHE_SIZE = 10
const stringCache = new Map<string, Promise<ImageSize>>()
const blobCache = new WeakMap<Blob, Map<string, Promise<ImageSize>>>()
let cacheBustCounter = 0

function createOptionsKey(
  timeout: number,
  decoding: NonNullable<LoadImageDimensionsOptions['decoding']>,
  crossOrigin: Exclude<LoadImageDimensionsOptions['crossOrigin'], undefined>,
): string {
  return `${timeout}:${decoding}:${crossOrigin ?? 'none'}`
}

function createStringCacheKey(source: string, optionsKey: string): string {
  return `${optionsKey}:${source}`
}

function addCacheBuster(source: string): string {
  const hashIndex = source.indexOf('#')
  const beforeHash = hashIndex === -1 ? source : source.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : source.slice(hashIndex)
  const separator = beforeHash.includes('?') ? '&' : '?'
  cacheBustCounter++
  return `${beforeHash}${separator}__ntnyq_cache_bust=${Date.now()}-${cacheBustCounter}${hash}`
}

function redactSource(source: string): string {
  return source.split(/[?#]/u, 1)[0] ?? source
}

function cacheStringPromise(key: string, promise: Promise<ImageSize>): void {
  stringCache.set(key, promise)
  if (stringCache.size > MAX_STRING_CACHE_SIZE) {
    const oldestKey = stringCache.keys().next().value
    if (oldestKey !== undefined) {
      stringCache.delete(oldestKey)
    }
  }

  // oxlint-disable-next-line promise/prefer-await-to-then
  promise.catch(() => {
    if (stringCache.get(key) === promise) {
      stringCache.delete(key)
    }
  })
}

function cacheBlobPromise(
  source: Blob,
  key: string,
  promise: Promise<ImageSize>,
): void {
  const entries = blobCache.get(source) ?? new Map<string, Promise<ImageSize>>()
  entries.set(key, promise)
  blobCache.set(source, entries)

  if (entries.size > MAX_BLOB_OPTION_CACHE_SIZE) {
    const oldestKey = entries.keys().next().value
    if (oldestKey !== undefined) {
      entries.delete(oldestKey)
    }
  }

  // oxlint-disable-next-line promise/prefer-await-to-then
  promise.catch(() => {
    if (entries.get(key) === promise) {
      entries.delete(key)
    }
  })
}

interface LoadImageOptions {
  timeout: number
  decoding: NonNullable<LoadImageDimensionsOptions['decoding']>
  crossOrigin: Exclude<LoadImageDimensionsOptions['crossOrigin'], undefined>
}

function loadImage(
  source: string,
  displaySource: string,
  isObjectURL: boolean,
  options: LoadImageOptions,
): Promise<ImageSize> {
  return new Promise<ImageSize>((resolve, reject) => {
    const image = new Image()
    let isSettled = false

    const timer = setTimeout(onTimeout, options.timeout)

    const cleanup = () => {
      clearTimeout(timer)
      image.onload = null
      image.onerror = null
      image.onabort = null
      image.src = ''
      if (isObjectURL) {
        URL.revokeObjectURL(source)
      }
    }

    const settle = (callback: () => void) => {
      if (isSettled) {
        return
      }
      isSettled = true
      cleanup()
      callback()
    }

    function onTimeout() {
      settle(() => {
        reject(
          new Error(
            `Failed to load image: ${displaySource} within ${options.timeout}ms`,
          ),
        )
      })
    }

    image.onload = () => {
      const size = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
      settle(() => resolve(size))
    }
    image.onerror = () => {
      settle(() => reject(new Error(`Failed to load image: ${displaySource}`)))
    }
    image.onabort = () => {
      settle(() => reject(new Error(`Image loading aborted: ${displaySource}`)))
    }

    image.decoding = options.decoding
    image.crossOrigin = options.crossOrigin
    image.src = source
  })
}

/**
 * Loads an image source and resolves its natural dimensions.
 * @param source - The image URL, Blob, or File to load.
 * @param options - Loading and cache options.
 * @returns A promise that resolves with the image's natural dimensions.
 */
export async function loadImageDimensions(
  source: string | Blob | File,
  options: LoadImageDimensionsOptions = {},
): Promise<ImageSize> {
  const {
    timeout = 30_000,
    crossOrigin = 'anonymous',
    cache = true,
    decoding = 'async',
  } = options

  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new RangeError('Image timeout must be a positive finite number')
  }

  const optionsKey = createOptionsKey(timeout, decoding, crossOrigin)

  if (isString(source)) {
    const key = createStringCacheKey(source, optionsKey)
    const cached = cache ? stringCache.get(key) : undefined
    if (cached) {
      stringCache.delete(key)
      stringCache.set(key, cached)
      return cached
    }

    const loadSource = cache ? source : addCacheBuster(source)
    const promise = loadImage(loadSource, redactSource(source), false, {
      timeout,
      decoding,
      crossOrigin,
    })
    if (cache) {
      cacheStringPromise(key, promise)
    }
    return promise
  }

  const cached = cache ? blobCache.get(source)?.get(optionsKey) : undefined
  if (cached) {
    return cached
  }

  const objectURL = URL.createObjectURL(source)
  const promise = loadImage(objectURL, 'blob', true, {
    timeout,
    decoding,
    crossOrigin,
  })
  if (cache) {
    cacheBlobPromise(source, optionsKey, promise)
  }
  return promise
}
