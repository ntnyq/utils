import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isElementVisibleInViewport,
  openExternalURL,
  scrollElementIntoView,
} from '../src/dom'
import { getImageNaturalSize } from '../src/dom/getImageNaturalSize'

const originalDocument = globalThis.document
const originalWindow = globalThis.window
const originalImage = globalThis.Image
const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

class MockImage {
  static instances: MockImage[] = []

  onload: null | (() => void) = null
  onerror: null | (() => void) = null
  onabort: null | (() => void) = null

  naturalWidth = 0
  naturalHeight = 0
  decoding: 'sync' | 'async' | 'auto' = 'auto'
  crossOrigin: null | string = null

  private _src = ''

  constructor() {
    MockImage.instances.push(this)
  }

  get src() {
    return this._src
  }

  set src(value: string) {
    this._src = value
  }
}

describe(isElementVisibleInViewport, () => {
  afterEach(() => {
    globalThis.window = originalWindow
  })

  it('should detect visibility within viewport', () => {
    const element = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50,
      }),
    } as unknown as HTMLElement

    const targetWindow = {
      innerWidth: 100,
      innerHeight: 100,
    } as unknown as Window
    expect(isElementVisibleInViewport(element, targetWindow)).toBeTruthy()
  })

  it('should detect element outside viewport', () => {
    const element = {
      getBoundingClientRect: () => ({
        top: -20,
        left: -20,
        bottom: -10,
        right: -10,
      }),
    } as unknown as HTMLElement
    const targetWindow = {
      innerWidth: 100,
      innerHeight: 100,
    } as unknown as Window
    expect(isElementVisibleInViewport(element, targetWindow)).toBeFalsy()
  })

  it('should return false when no window is available', () => {
    // @ts-expect-error testing non-browser environment
    globalThis.window = undefined

    const element = {
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50,
      }),
    } as unknown as HTMLElement

    expect(isElementVisibleInViewport(element)).toBeFalsy()
  })
})

describe(scrollElementIntoView, () => {
  afterEach(() => {
    globalThis.document = originalDocument
  })

  it('should scroll target element when parent is body', () => {
    const body = {
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement
    // @ts-expect-error assign
    globalThis.document = { body }

    const element = {
      scrollIntoView: vi.fn(),
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        bottom: 20,
        right: 20,
      }),
    } as unknown as HTMLElement

    scrollElementIntoView(element, { behavior: 'smooth' })

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    })
    expect(body.scrollIntoView).not.toHaveBeenCalled()
  })

  it('should scroll target element when it is outside custom parent view', () => {
    const body = {
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement
    // @ts-expect-error assign
    globalThis.document = { body }

    const parent = {
      scrollIntoView: vi.fn(),
      scrollWidth: 100,
      scrollHeight: 200,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      }),
    } as unknown as HTMLElement

    const element = {
      scrollIntoView: vi.fn(),
      getBoundingClientRect: () => ({
        top: 150,
        left: 10,
        bottom: 170,
        right: 30,
      }),
    } as unknown as HTMLElement

    scrollElementIntoView(element, { parent, block: 'nearest' })

    expect(element.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })
    expect(parent.scrollIntoView).not.toHaveBeenCalled()
  })

  it('should not scroll when target element is already visible', () => {
    const body = {
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement
    // @ts-expect-error assign
    globalThis.document = { body }

    const parent = {
      scrollIntoView: vi.fn(),
      scrollWidth: 100,
      scrollHeight: 200,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      }),
    } as unknown as HTMLElement

    const element = {
      scrollIntoView: vi.fn(),
      getBoundingClientRect: () => ({
        top: 10,
        left: 10,
        bottom: 30,
        right: 30,
      }),
    } as unknown as HTMLElement

    scrollElementIntoView(element, { parent })

    expect(element.scrollIntoView).not.toHaveBeenCalled()
    expect(parent.scrollIntoView).not.toHaveBeenCalled()
  })
})

describe(openExternalURL, () => {
  beforeEach(() => {
    // @ts-expect-error assign
    globalThis.window = { open: vi.fn(() => ({ closed: false })) }
  })

  afterEach(() => {
    globalThis.window = originalWindow
  })

  it('should open URL with default target', () => {
    const proxy = openExternalURL('https://example.com')
    const spy = window.open as ReturnType<typeof vi.fn>
    expect(spy).toHaveBeenCalledWith('https://example.com', '_blank')
    expect(proxy).toStrictEqual({ closed: false })
  })

  it('should open URL with custom target', () => {
    openExternalURL('https://example.com', { target: '_self' })
    const spy = window.open as ReturnType<typeof vi.fn>
    expect(spy).toHaveBeenCalledWith('https://example.com', '_self')
  })
})

describe(getImageNaturalSize, () => {
  beforeEach(() => {
    MockImage.instances = []
    vi.useRealTimers()

    // @ts-expect-error assign
    globalThis.Image = MockImage

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:mock-url'),
    })

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    globalThis.Image = originalImage

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL,
    })

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: originalRevokeObjectURL,
    })

    vi.useRealTimers()
  })

  it('should resolve image size when loaded', async () => {
    const promise = getImageNaturalSize('https://example.com/image.png')
    const instance = MockImage.instances[0]!

    instance.naturalWidth = 640
    instance.naturalHeight = 360
    instance.onload?.()

    await expect(promise).resolves.toStrictEqual({ width: 640, height: 360 })
    expect(instance.decoding).toBe('async')
    expect(instance.crossOrigin).toBe('anonymous')
  })

  it('should reject when image load fails', async () => {
    const promise = getImageNaturalSize('https://example.com/fail.png')
    const instance = MockImage.instances[0]!

    instance.onerror?.()

    await expect(promise).rejects.toThrow(
      'Failed to load image: https://example.com/fail.png',
    )
  })

  it('should reject when image loading is aborted', async () => {
    const promise = getImageNaturalSize('https://example.com/abort.png')
    const instance = MockImage.instances[0]!

    instance.onabort?.()

    await expect(promise).rejects.toThrow(
      'Image loading aborted: https://example.com/abort.png',
    )
  })

  it('should reject when loading times out', async () => {
    vi.useFakeTimers()
    const promise = getImageNaturalSize('https://example.com/timeout.png', {
      timeout: 10,
    })

    await Promise.all([
      expect(promise).rejects.toThrow('within 10ms'),
      vi.advanceTimersByTimeAsync(11),
    ])
  })

  it('should cache promise for identical string source by default', async () => {
    const first = getImageNaturalSize('https://example.com/cache.png')
    const second = getImageNaturalSize('https://example.com/cache.png')

    expect(MockImage.instances).toHaveLength(1)

    const instance = MockImage.instances[0]!
    instance.naturalWidth = 300
    instance.naturalHeight = 200
    instance.onload?.()

    await expect(first).resolves.toStrictEqual({ width: 300, height: 200 })
    await expect(second).resolves.toStrictEqual({ width: 300, height: 200 })
  })

  it('should skip cache when cache option is false', async () => {
    const first = getImageNaturalSize('https://example.com/no-cache.png', {
      cache: false,
    })
    const second = getImageNaturalSize('https://example.com/no-cache.png', {
      cache: false,
    })

    expect(first).not.toBe(second)
    expect(MockImage.instances).toHaveLength(2)

    MockImage.instances[0]!.naturalWidth = 10
    MockImage.instances[0]!.naturalHeight = 20
    MockImage.instances[0]!.onload?.()

    MockImage.instances[1]!.naturalWidth = 30
    MockImage.instances[1]!.naturalHeight = 40
    MockImage.instances[1]!.onload?.()

    await expect(first).resolves.toStrictEqual({ width: 10, height: 20 })
    await expect(second).resolves.toStrictEqual({ width: 30, height: 40 })
  })

  it('should create and revoke object URL for blob source', async () => {
    const blob = new Blob(['image-binary'], { type: 'image/png' })
    const promise = getImageNaturalSize(blob)
    const instance = MockImage.instances[0]!

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(instance.src).toBe('blob:mock-url')

    instance.naturalWidth = 120
    instance.naturalHeight = 80
    instance.onload?.()

    await expect(promise).resolves.toStrictEqual({ width: 120, height: 80 })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('should not set crossOrigin when crossOrigin is null', async () => {
    const promise = getImageNaturalSize(
      'https://example.com/no-cross-origin.png',
      { crossOrigin: null },
    )
    const instance = MockImage.instances[0]!

    expect(instance.crossOrigin).toBeNull()

    instance.naturalWidth = 88
    instance.naturalHeight = 66
    instance.onload?.()

    await expect(promise).resolves.toStrictEqual({ width: 88, height: 66 })
  })
})
