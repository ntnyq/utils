import { describe, expect, it } from 'vitest'
import { safeStringify } from '../src/json'

describe(safeStringify, () => {
  it('should serialize BigInt, Error, and circular references', () => {
    const cause = new Error('network unavailable')
    const error = new TypeError('request failed', { cause })
    const value: Record<string, unknown> = {
      amount: 12n,
      error,
    }
    value['self'] = value

    expect(JSON.parse(safeStringify(value))).toMatchObject({
      amount: '12n',
      error: {
        cause: {
          message: 'network unavailable',
          name: 'Error',
        },
        message: 'request failed',
        name: 'TypeError',
      },
      self: '[Circular]',
    })
  })

  it('should serialize repeated non-circular references independently', () => {
    const shared = { id: 1 }

    expect(safeStringify({ left: shared, right: shared })).toBe(
      '{"left":{"id":1},"right":{"id":1}}',
    )
  })

  it('should support custom serializers, replacer, indentation, and cycles', () => {
    const value: Record<string, unknown> = {
      amount: 12n,
      error: new Error('failed'),
      secret: 'remove-me',
    }
    value['self'] = value

    const serialized = safeStringify(value, {
      bigintSerializer: Number,
      circularValue: null,
      errorSerializer: error => ({ reason: error.message }),
      replacer: (key, nestedValue) =>
        key === 'secret' ? undefined : nestedValue,
      space: 2,
    })

    expect(serialized).toContain('\n')
    expect(JSON.parse(serialized)).toStrictEqual({
      amount: 12,
      error: { reason: 'failed' },
      self: null,
    })
  })

  it('should return the configured fallback when serialization fails', () => {
    const error = new Error('getter failed')
    const value = Object.defineProperty({}, 'broken', {
      enumerable: true,
      get: () => {
        throw error
      },
    })

    expect(
      safeStringify(value, {
        fallback: receivedError =>
          receivedError === error ? '[Getter failed]' : '[Unknown failure]',
      }),
    ).toBe('[Getter failed]')
    expect(safeStringify(undefined, { fallback: '[Undefined]' })).toBe(
      '[Undefined]',
    )
  })
})
