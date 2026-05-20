import { describe, expect, it, vi } from 'vitest'
import { NOOP, noop, once } from '../src/fn'

describe(noop, () => {
  it('should do nothing and return void', () => {
    expect(noop()).toBeUndefined()
  })

  it('nOOP should be alias of noop', () => {
    expect(NOOP).toBe(noop)
    const spy = vi.fn()
    // Ensure it can be used interchangeably
    // oxlint-disable-next-line new-cap
    expect(spy(NOOP())).toBeUndefined()
  })
})

describe(once, () => {
  it('should invoke only on first call', () => {
    const spy = vi.fn()
    const fn = once(spy)

    expect(fn()).toBeTruthy()
    expect(fn()).toBeFalsy()
    expect(spy).toHaveBeenCalledOnce()
  })

  it('should pass arguments and preserve this', () => {
    const ctx = { x: 42 }
    const spy = vi.fn(function spy(this: typeof ctx, a: number, b: string) {
      expect(this).toBe(ctx)
      expect(a).toBe(1)
      expect(b).toBe('b')
    })
    const fn = once(spy)

    expect(fn.call(ctx, 1, 'b')).toBeTruthy()
    expect(fn.call(ctx, 2, 'c')).toBeFalsy()
    expect(spy).toHaveBeenCalledOnce()
  })
})
