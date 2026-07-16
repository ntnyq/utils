import { describe, expect, it } from 'vitest'
import { interopDefault, resolveSubOptions } from '../src/module'

describe(interopDefault, () => {
  it('should return default export when present', async () => {
    const mod = Promise.resolve({ default: { x: 1 } })
    const result = await interopDefault(mod)
    expect(result).toStrictEqual({ x: 1 })
  })

  it('should return module itself when no default', async () => {
    const mod = Promise.resolve({ x: 2 })
    const result = await interopDefault(mod)
    expect(result).toStrictEqual({ x: 2 })
  })

  it('should preserve falsy default exports', async () => {
    await expect(interopDefault({ default: 0 })).resolves.toBe(0)
    await expect(interopDefault({ default: false })).resolves.toBeFalsy()
    await expect(interopDefault({ default: '' })).resolves.toBe('')
    await expect(interopDefault({ default: null })).resolves.toBeNull()
  })

  it('should handle nullish modules', async () => {
    await expect(interopDefault(null)).resolves.toBeNull()
    await expect(interopDefault(undefined)).resolves.toBeUndefined()
  })
})

describe(resolveSubOptions, () => {
  it('should resolve boolean to empty object', () => {
    const options = { compile: true }
    expect(resolveSubOptions(options, 'compile')).toStrictEqual({})
  })

  it('should pass through object value', () => {
    const options = { compile: { include: ['a'], exclude: ['b'] } }
    expect(resolveSubOptions(options, 'compile')).toStrictEqual({
      include: ['a'],
      exclude: ['b'],
    })
  })

  it('should return empty object for undefined', () => {
    const options: { compile?: boolean | { include?: string[] } } = {}
    expect(resolveSubOptions(options, 'compile')).toStrictEqual({})
  })
})
