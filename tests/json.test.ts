import { describe, expect, it } from 'vitest'
import { safeParse, safeStringify } from '../src/json'

describe(safeParse, () => {
  it.each([
    ['{"name":"Alice","count":2}', { count: 2, name: 'Alice' }],
    ['[1,true,null]', [1, true, null]],
    ['"value"', 'value'],
    ['42', 42],
    ['null', null],
  ])('should parse valid JSON: %s', (input, expected) => {
    expect(safeParse(input)).toStrictEqual({
      success: true,
      value: expected,
    })
  })

  it.each(['', '{', 'undefined', '{"value":}'])(
    'should return a failure for invalid JSON: %s',
    input => {
      const result = safeParse(input)

      expect(result).toStrictEqual({
        error: expect.any(SyntaxError),
        success: false,
      })
    },
  )

  it('should apply a reviver', () => {
    const result = safeParse('{"createdAt":"2026-07-26","count":2}', {
      reviver: (key, value) =>
        key === 'createdAt' ? new Date(String(value)) : value,
    })

    expect(result).toStrictEqual({
      success: true,
      value: {
        count: 2,
        createdAt: new Date('2026-07-26'),
      },
    })
  })

  it('should capture reviver failures', () => {
    const error = new Error('reviver failed')
    const result = safeParse('{"value":1}', {
      reviver: () => {
        throw error
      },
    })

    expect(result).toStrictEqual({
      error,
      success: false,
    })
  })

  it('should preserve a successful undefined root value from a reviver', () => {
    expect(
      safeParse('null', {
        reviver: () => undefined,
      }),
    ).toStrictEqual({
      success: true,
      value: undefined,
    })
  })
})

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
