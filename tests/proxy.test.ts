import { describe, expect, it } from 'vitest'
import { createOverlayProxy } from '../src/proxy'

describe(createOverlayProxy, () => {
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
})
