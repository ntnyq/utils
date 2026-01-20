import { describe, expect, it } from 'vitest'
import { interopDefault, resolveSubOptions } from '../src/module'

describe('interopDefault', () => {
  it('should return default export when present', async () => {
    const mod = Promise.resolve({ default: { x: 1 } })
    const result = await interopDefault(mod)
    expect(result).toEqual({ x: 1 })
  })

  it('should return module itself when no default', async () => {
    const mod = Promise.resolve({ x: 2 })
    const result = await interopDefault(mod)
    expect(result).toEqual({ x: 2 })
  })
})

describe('resolveSubOptions', () => {
  it('should resolve boolean to empty object', () => {
    const options = { compile: true }
    expect(resolveSubOptions(options, 'compile')).toEqual({})
  })

  it('should pass through object value', () => {
    const options = { compile: { include: ['a'], exclude: ['b'] } }
    expect(resolveSubOptions(options, 'compile')).toEqual({
      include: ['a'],
      exclude: ['b'],
    })
  })

  it('should return empty object for undefined', () => {
    const options: { compile?: boolean | { include?: string[] } } = {}
    expect(resolveSubOptions(options, 'compile')).toEqual({})
  })
})
