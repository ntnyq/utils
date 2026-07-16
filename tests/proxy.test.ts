import { describe, expect, it } from 'vitest'
import { enhance } from '../src/proxy'

describe(enhance, () => {
  it('should overlay extra properties and preserve originals', () => {
    const base = { a: 1, b: 2 }
    const extra = { b: 3, c: 4 }

    const proxied = enhance(base, extra)

    expect(proxied.a).toBe(1)
    expect(proxied.b).toBe(3)
    expect(proxied.c).toBe(4)
    expect('a' in proxied).toBeTruthy()
    expect('b' in proxied).toBeTruthy()
    expect('c' in proxied).toBeTruthy()
  })
})
