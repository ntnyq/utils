import { describe, expect, it, vi } from 'vitest'
import { NOOP, noop, once } from '../src/fn'

describe('noop', () => {
  it('should do nothing and return void', () => {
    expect(noop()).toBeUndefined()
  })

  it('NOOP should be alias of noop', () => {
    expect(NOOP).toBe(noop)
    const spy = vi.fn()
    // Ensure it can be used interchangeably
    expect(spy(NOOP())).toBeUndefined()
  })
})

describe('once', () => {
  it('should invoke only on first call', () => {
    const spy = vi.fn()
    const fn = once(spy)

    expect(fn()).toBe(true)
    expect(fn()).toBe(false)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments and preserve this', () => {
    const ctx = { x: 42 }
    const spy = vi.fn(function (this: typeof ctx, a: number, b: string) {
      expect(this).toBe(ctx)
      expect(a).toBe(1)
      expect(b).toBe('b')
    })
    const fn = once(spy)

    expect(fn.call(ctx, 1, 'b')).toBe(true)
    expect(fn.call(ctx, 2, 'c')).toBe(false)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
