import { describe, expect, it, vi } from 'vitest'
import {
  compose,
  debounce,
  memoize,
  NOOP,
  noop,
  once,
  pipe,
  throttle,
} from '../src/function'

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

  it('should not collide for different argument tuples or object identities', () => {
    const spy = vi.fn((left: unknown, right: number) => ({ left, right }))
    const memoized = memoize(spy)
    const first = memoized(undefined, 1)
    const second = memoized(null, 1)
    const objectA = memoized({}, 1)
    const objectB = memoized({}, 1)

    expect(first).not.toBe(second)
    expect(objectA).not.toBe(objectB)
    expect(spy).toHaveBeenCalledTimes(4)
  })

  it('should include the receiver in default cache identity', () => {
    const spy = vi.fn(function multiply(
      this: { factor: number },
      value: number,
    ) {
      return this.factor * value
    })
    const memoized = memoize(spy)

    expect(memoized.call({ factor: 2 }, 3)).toBe(6)
    expect(memoized.call({ factor: 4 }, 3)).toBe(12)
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('should reject invalid cache size limits', () => {
    expect(() => memoize((value: number) => value, { maxSize: 0 })).toThrow(
      RangeError,
    )
    expect(() => memoize((value: number) => value, { maxSize: 1.5 })).toThrow(
      RangeError,
    )
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

describe('throttle/debounce', () => {
  it('throttle should limit calls', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = throttle(50, spy)
    fn()
    fn()
    vi.advanceTimersByTime(60)
    fn()
    expect(spy).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('debounce should delay calls', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(50, spy)
    fn()
    fn()
    // Leading-edge debounce: first call invokes immediately
    expect(spy).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(50)
    // No trailing call in current implementation
    expect(spy).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('cancel should prevent further execution', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(50, spy)
    fn()
    fn.cancel()
    vi.advanceTimersByTime(60)
    // First call already executed; cancel prevents further calls
    expect(spy).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})
