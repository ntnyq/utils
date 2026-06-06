import { describe, expect, it, vi } from 'vitest'
import { compose, memoize, NOOP, noop, once, pipe } from '../src/fn'

const add1 = (value: number) => value + 1
const double = (value: number) => value * 2
const toLabel = (value: number) => `v:${value}`

const trimText = (value: string) => value.trim()
const upperText = (value: string) => value.toUpperCase()
const addPrefix = (value: string) => `ID-${value}`

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

describe(memoize, () => {
  it('should cache computed results', () => {
    const spy = vi.fn((value: number) => value * 2)
    const memoized = memoize(spy)

    expect(memoized(2)).toBe(4)
    expect(memoized(2)).toBe(4)
    expect(spy).toHaveBeenCalledOnce()
  })

  it('should support custom resolver', () => {
    const spy = vi.fn((obj: { id: number }) => obj.id * 10)
    const memoized = memoize(spy, {
      resolver: obj => obj.id,
    })

    expect(memoized({ id: 1 })).toBe(10)
    expect(memoized({ id: 1 })).toBe(10)
    expect(spy).toHaveBeenCalledOnce()
  })

  it('should evict oldest entry when maxSize is reached', () => {
    const spy = vi.fn((value: number) => value)
    const memoized = memoize(spy, { maxSize: 2 })

    expect(memoized(1)).toBe(1)
    expect(memoized(2)).toBe(2)
    expect(memoized(3)).toBe(3)

    // Key 1 should be evicted
    expect(memoized(1)).toBe(1)
    expect(spy).toHaveBeenCalledTimes(4)
  })

  it('should expose cache and clear methods', () => {
    const memoized = memoize((value: number) => value + 1)
    memoized(1)
    memoized(2)

    expect(memoized.cache.size).toBe(2)

    memoized.clear()
    expect(memoized.cache.size).toBe(0)
  })
})

describe(compose, () => {
  it('should compose functions from right to left', () => {
    const fn = compose(toLabel, double, add1)
    expect(fn(2)).toBe('v:6')
  })

  it('should return identity for empty compose', () => {
    const identity = compose()
    expect(identity('x')).toBe('x')
  })
})

describe(pipe, () => {
  it('should pipe functions from left to right', () => {
    const fn = pipe(trimText, upperText, addPrefix)
    expect(fn('  abc  ')).toBe('ID-ABC')
  })

  it('should return identity for empty pipe', () => {
    const identity = pipe()
    expect(identity(123)).toBe(123)
  })
})
