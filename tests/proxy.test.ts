import { describe, expect, it } from 'vitest'
import { createOverlayProxy } from '../src/proxy'

describe(createOverlayProxy, () => {
  it('should reject non-configurable definitions without mutating the target', () => {
    const target = { existing: 1 }
    const proxy = createOverlayProxy(target, {})

    expect(() =>
      Object.defineProperty(proxy, 'newKey', {
        configurable: false,
        value: 2,
      }),
    ).toThrow(TypeError)
    expect(
      Reflect.defineProperty(proxy, 'existing', {
        configurable: false,
        value: 3,
      }),
    ).toBeFalsy()
    expect(Reflect.defineProperty(proxy, 'implicit', { value: 4 })).toBeFalsy()
    expect(target).toStrictEqual({ existing: 1 })
    expect(
      Object.getOwnPropertyDescriptor(target, 'existing')?.configurable,
    ).toBeTruthy()
  })

  it('should forward configurable definitions and updates', () => {
    const target = { existing: 1 }
    const proxy = createOverlayProxy(target, {})

    expect(
      Reflect.defineProperty(proxy, 'newKey', {
        configurable: true,
        enumerable: true,
        value: 2,
      }),
    ).toBeTruthy()
    expect(Reflect.defineProperty(proxy, 'existing', { value: 3 })).toBeTruthy()
    expect({ ...proxy }).toStrictEqual({ existing: 3, newKey: 2 })
    expect(target).toStrictEqual({ existing: 3, newKey: 2 })
  })

  it('should overlay properties and preserve the target', () => {
    const target = { a: 1, b: 2 }
    const overlay = { b: 3, c: 4 }

    const proxied = createOverlayProxy(target, overlay)

    expect(proxied.a).toBe(1)
    expect(proxied.b).toBe(3)
    expect(proxied.c).toBe(4)
    expect('a' in proxied).toBeTruthy()
    expect('b' in proxied).toBeTruthy()
    expect('c' in proxied).toBeTruthy()
  })

  it('should overlay frozen target properties without violating proxy invariants', () => {
    const proxied = createOverlayProxy(Object.freeze({ a: 1 }), {
      a: 2,
      b: 3,
    })

    expect(proxied.a).toBe(2)
    expect(proxied.b).toBe(3)
  })

  it('should expose target and overlay keys to reflection', () => {
    const symbol = Symbol('overlay')
    const proxied = createOverlayProxy(
      { a: 1, b: 2 },
      { b: 3, c: 4, [symbol]: 5 },
    )

    expect(Object.keys(proxied)).toStrictEqual(['a', 'b', 'c'])
    expect(Reflect.ownKeys(proxied)).toStrictEqual(['a', 'b', 'c', symbol])
    expect({ ...proxied }).toStrictEqual({
      a: 1,
      b: 3,
      c: 4,
      [symbol]: 5,
    })
  })

  it('should continue forwarding writes and deletions to the target', () => {
    const target: { a?: number; b?: number } = { a: 1 }
    const proxied = createOverlayProxy(target, { overlay: true })

    proxied.b = 2
    delete proxied.a

    expect(target).toStrictEqual({ b: 2 })
  })
})
