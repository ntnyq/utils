import { describe, expect, it } from 'vitest'
import { enhance } from '../src/proxy'

describe('enhance', () => {
  it('should overlay extra properties and preserve originals', () => {
    const base = { a: 1, b: 2 }
    const extra = { b: 3, c: 4 }

    const proxied = enhance(base, extra)

    expect(proxied.a).toBe(1)
    expect(proxied.b).toBe(3)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((proxied as any).c).toBe(4)
    expect('a' in proxied).toBe(true)
    expect('b' in proxied).toBe(true)
    expect('c' in proxied).toBe(true)
  })
})
