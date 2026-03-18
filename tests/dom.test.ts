import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isElementVisibleInViewport, openExternalURL } from '../src/dom'

const originalWindow = globalThis.window

describe(isElementVisibleInViewport, () => {
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
    expect(proxy).toEqual({ closed: false })
  })

  it('should open URL with custom target', () => {
    openExternalURL('https://example.com', { target: '_self' })
    const spy = window.open as ReturnType<typeof vi.fn>
    expect(spy).toHaveBeenCalledWith('https://example.com', '_self')
  })
})
