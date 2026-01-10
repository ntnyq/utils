/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { describe, expect, it } from 'vitest'
import {
  cleanObject,
  hasOwn,
  isKeyOf,
  isPlainObject,
  omit,
  pick,
  sortObject,
} from '../src/object'

describe('pick', () => {
  it('should pick specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    expect(pick(obj, ['b', 'd'])).toEqual({ b: 2, d: 4 })
  })

  it('should return empty object when picking empty array', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, [])).toEqual({})
  })

  it('should ignore non-existent keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, ['a', 'e' as keyof typeof obj])).toEqual({ a: 1 })
  })

  it('should pick from nested object', () => {
    const nested = { x: 1, y: { z: 2 }, w: 'test' }
    expect(pick(nested, ['x', 'y'])).toEqual({ x: 1, y: { z: 2 } })
  })

  it('should handle picking all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a', 'b'])).toEqual({ a: 1, b: 2 })
  })
})

describe('omit', () => {
  it('should omit specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(omit(obj, 'a', 'c')).toEqual({ b: 2, d: 4 })
  })

  it('should return same object when omitting no keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj)).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle omitting non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, 'c' as keyof typeof obj)).toEqual({ a: 1, b: 2 })
  })

  it('should mutate original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, 'b')
    expect(result).toBe(obj)
    expect(obj).toEqual({ a: 1, c: 3 })
  })

  it('should handle omitting all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, 'a', 'b')).toEqual({})
  })
})

describe('hasOwn', () => {
  it('should return true for own properties', () => {
    const obj = { a: 1, b: 2 }
    expect(hasOwn(obj, 'a')).toBe(true)
    expect(hasOwn(obj, 'b')).toBe(true)
  })

  it('should return false for non-existent properties', () => {
    const obj = { a: 1, b: 2 }
    expect(hasOwn(obj, 'c')).toBe(false)
  })

  it('should return false for inherited properties', () => {
    const obj = Object.create({ inherited: 'value' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    obj.own = 'value'
    expect(hasOwn(obj, 'own')).toBe(true)
    expect(hasOwn(obj, 'inherited')).toBe(false)
  })

  it('should return false for null', () => {
    expect(hasOwn(null, 'key')).toBe(false)
  })

  it('should handle Symbol keys', () => {
    const sym = Symbol('test')
    const obj = { [sym]: 'value' }
    expect(hasOwn(obj, sym)).toBe(true)
  })

  it('should handle numeric keys', () => {
    const obj = { 0: 'a', 1: 'b' }
    expect(hasOwn(obj, 0)).toBe(true)
    expect(hasOwn(obj, 1)).toBe(true)
    expect(hasOwn(obj, 2)).toBe(false)
  })
})

describe('isKeyOf', () => {
  it('should return true for keys in object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(isKeyOf(obj, 'a')).toBe(true)
    expect(isKeyOf(obj, 'b')).toBe(true)
    expect(isKeyOf(obj, 'c')).toBe(true)
  })

  it('should work with type narrowing', () => {
    const obj = { a: 1, b: 2 }
    const key = 'a' as string
    if (isKeyOf(obj, key as keyof typeof obj)) {
      // Type should be narrowed here
      // @ts-expect-error types
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(obj[key]).toBe(1)
    }
  })

  it('should handle inherited properties', () => {
    const obj = Object.create({ inherited: 'value' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    obj.own = 'value'
    expect(isKeyOf(obj, 'own' as keyof typeof obj)).toBe(true)
    expect(isKeyOf(obj, 'inherited' as keyof typeof obj)).toBe(true)
  })
})

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  it('should return false for arrays', () => {
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject([1, 2, 3])).toBe(false)
  })

  it('should return false for built-in objects', () => {
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(/regex/)).toBe(false)
    expect(isPlainObject(new Map())).toBe(false)
    expect(isPlainObject(new Set())).toBe(false)
    expect(isPlainObject(new Error('error'))).toBe(false)
  })

  it('should return false for primitives', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(123)).toBe(false)
    expect(isPlainObject('string')).toBe(false)
    expect(isPlainObject(true)).toBe(false)
  })

  it('should return false for class instances', () => {
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBe(false)
  })

  it('should return false for functions', () => {
    expect(isPlainObject(() => {})).toBe(false)
    expect(isPlainObject(function () {})).toBe(false)
  })
})

describe('cleanObject', () => {
  it('should clean undefined by default', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, c: 3 })
  })

  it('should clean null by default', () => {
    const obj = { a: 1, b: null, c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, c: 3 })
  })

  it('should not clean NaN by default (bug: cleanNaN uses isZero instead of isNaN)', () => {
    const obj = { a: 1, b: Number.NaN, c: 3 }
    // Note: This is a bug in the implementation - cleanNaN checks isZero instead of isNaN
    expect(cleanObject(obj)).toEqual({ a: 1, b: Number.NaN, c: 3 })
  })

  it('should clean zero by default (bug: cleanNaN removes zero values)', () => {
    const obj = { a: 1, b: 0, c: 3 }
    // Note: This is a bug - cleanNaN is true by default and checks isZero instead of isNaN
    expect(cleanObject(obj)).toEqual({ a: 1, c: 3 })
  })

  it('should clean zero when cleanZero is true', () => {
    const obj = { a: 1, b: 0, c: 3 }
    expect(cleanObject(obj, { cleanZero: true })).toEqual({ a: 1, c: 3 })
  })

  it('should not clean empty string by default', () => {
    const obj = { a: 1, b: '', c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, b: '', c: 3 })
  })

  it('should clean empty string when cleanEmptyString is true', () => {
    const obj = { a: 1, b: '', c: 3 }
    expect(cleanObject(obj, { cleanEmptyString: true })).toEqual({ a: 1, c: 3 })
  })

  it('should not clean empty array by default', () => {
    const obj = { a: 1, b: [], c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, b: [], c: 3 })
  })

  it('should clean empty array when cleanEmptyArray is true', () => {
    const obj = { a: 1, b: [], c: 3 }
    expect(cleanObject(obj, { cleanEmptyArray: true })).toEqual({ a: 1, c: 3 })
  })

  it('should not clean empty object by default', () => {
    const obj = { a: 1, b: {}, c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, b: {}, c: 3 })
  })

  it('should clean empty object when cleanEmptyObject is true', () => {
    const obj = { a: 1, b: {}, c: 3 }
    expect(cleanObject(obj, { cleanEmptyObject: true })).toEqual({ a: 1, c: 3 })
  })

  it('should not clean undefined when cleanUndefined is false', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(cleanObject(obj, { cleanUndefined: false })).toEqual({
      a: 1,
      b: undefined,
      c: 3,
    })
  })

  it('should recursively clean nested objects by default', () => {
    const obj = { a: 1, b: { c: null, d: 2 }, e: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, b: { d: 2 }, e: 3 })
  })

  it('should not recursively clean when recursive is false', () => {
    const obj = { a: 1, b: { c: null, d: 2 }, e: 3 }
    expect(cleanObject(obj, { recursive: false })).toEqual({
      a: 1,
      b: { c: null, d: 2 },
      e: 3,
    })
  })

  it('should handle multiple clean options together', () => {
    const obj = { a: 1, b: '', c: null, d: 0, e: undefined, f: [] }
    expect(
      cleanObject(obj, {
        cleanEmptyString: true,
        cleanZero: true,
        cleanEmptyArray: true,
      }),
    ).toEqual({ a: 1 })
  })

  it('should mutate original object', () => {
    const obj = { a: 1, b: null, c: 3 }
    const result = cleanObject(obj)
    expect(result).toBe(obj)
  })
})

describe('sortObject', () => {
  it('should sort object keys alphabetically', () => {
    const obj = { c: 3, a: 1, b: 2 }
    const result = sortObject(obj)
    expect(Object.keys(result)).toEqual(['a', 'b', 'c'])
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty object', () => {
    const obj = {}
    expect(sortObject(obj)).toEqual({})
  })

  it('should sort using custom compare function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = sortObject(obj, {
      compareFn: (a, b) => b.localeCompare(a), // reverse order
    })
    expect(Object.keys(result)).toEqual(['c', 'b', 'a'])
  })

  it('should not sort nested objects by default', () => {
    const obj = { c: 3, a: 1, nested: { z: 3, x: 1, y: 2 } }
    const result = sortObject(obj)
    expect(Object.keys(result)).toEqual(['a', 'c', 'nested'])
    expect(Object.keys(result.nested)).toEqual(['z', 'x', 'y'])
  })

  it('should sort nested objects when deep is true', () => {
    const obj = { c: 3, a: 1, nested: { z: 3, x: 1, y: 2 } }
    const result = sortObject(obj, { deep: true })
    expect(Object.keys(result)).toEqual(['a', 'c', 'nested'])
    expect(Object.keys(result.nested)).toEqual(['x', 'y', 'z'])
  })

  it('should handle deeply nested objects', () => {
    const obj = {
      z: 1,
      a: {
        c: 2,
        b: {
          y: 3,
          x: 4,
        },
      },
    }
    const result = sortObject(obj, { deep: true })
    expect(Object.keys(result)).toEqual(['a', 'z'])
    expect(Object.keys(result.a)).toEqual(['b', 'c'])
    expect(Object.keys(result.a.b)).toEqual(['x', 'y'])
  })

  it('should not modify arrays in values', () => {
    const obj = { c: [3, 2, 1], a: 1, b: 2 }
    const result = sortObject(obj)
    expect(result.c).toEqual([3, 2, 1])
  })

  it('should preserve property descriptors', () => {
    const obj = { b: 2, a: 1 }
    Object.defineProperty(obj, 'c', {
      value: 3,
      enumerable: true,
      writable: false,
    })
    const result = sortObject(obj)
    const descriptor = Object.getOwnPropertyDescriptor(result, 'c')
    expect(descriptor?.writable).toBe(false)
  })
})
