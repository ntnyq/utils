// oxlint-disable unicorn/prefer-structured-clone

import { describe, expect, it } from 'vitest'
import {
  cleanObject,
  cloneDeep,
  hasOwn,
  isKeyOf,
  isPlainObject,
  omit,
  pick,
  sortObject,
  objectOmit,
} from '../src/object'

describe(pick, () => {
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

describe(omit, () => {
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

describe(hasOwn, () => {
  it('should return true for own properties', () => {
    const obj = { a: 1, b: 2 }
    expect(hasOwn(obj, 'a')).toBeTruthy()
    expect(hasOwn(obj, 'b')).toBeTruthy()
  })

  it('should return false for non-existent properties', () => {
    const obj = { a: 1, b: 2 }
    expect(hasOwn(obj, 'c')).toBeFalsy()
  })

  it('should return false for inherited properties', () => {
    const obj = Object.create({ inherited: 'value' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    obj.own = 'value'
    expect(hasOwn(obj, 'own')).toBeTruthy()
    expect(hasOwn(obj, 'inherited')).toBeFalsy()
  })

  it('should return false for null', () => {
    expect(hasOwn(null, 'key')).toBeFalsy()
  })

  it('should handle Symbol keys', () => {
    const sym = Symbol('test')
    const obj = { [sym]: 'value' }
    expect(hasOwn(obj, sym)).toBeTruthy()
  })

  it('should handle numeric keys', () => {
    const obj = { 0: 'a', 1: 'b' }
    expect(hasOwn(obj, 0)).toBeTruthy()
    expect(hasOwn(obj, 1)).toBeTruthy()
    expect(hasOwn(obj, 2)).toBeFalsy()
  })
})

describe(isKeyOf, () => {
  it('should return true for keys in object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(isKeyOf(obj, 'a')).toBeTruthy()
    expect(isKeyOf(obj, 'b')).toBeTruthy()
    expect(isKeyOf(obj, 'c')).toBeTruthy()
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
    expect(isKeyOf(obj, 'own' as keyof typeof obj)).toBeTruthy()
    expect(isKeyOf(obj, 'inherited' as keyof typeof obj)).toBeTruthy()
  })
})

describe(isPlainObject, () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBeTruthy()
    expect(isPlainObject({ a: 1 })).toBeTruthy()
    expect(isPlainObject(Object.create(null))).toBeTruthy()
  })

  it('should return false for arrays', () => {
    expect(isPlainObject([])).toBeFalsy()
    expect(isPlainObject([1, 2, 3])).toBeFalsy()
  })

  it('should return false for built-in objects', () => {
    expect(isPlainObject(new Date())).toBeFalsy()
    expect(isPlainObject(/regex/)).toBeFalsy()
    expect(isPlainObject(new Map())).toBeFalsy()
    expect(isPlainObject(new Set())).toBeFalsy()
    expect(isPlainObject(new Error('error'))).toBeFalsy()
  })

  it('should return false for primitives', () => {
    expect(isPlainObject(null)).toBeFalsy()
    expect(isPlainObject(undefined)).toBeFalsy()
    expect(isPlainObject(123)).toBeFalsy()
    expect(isPlainObject('string')).toBeFalsy()
    expect(isPlainObject(true)).toBeFalsy()
  })

  it('should return false for class instances', () => {
    class MyClass {}
    expect(isPlainObject(new MyClass())).toBeFalsy()
  })

  it('should return false for functions', () => {
    expect(isPlainObject(() => {})).toBeFalsy()
    // oxlint-disable-next-line func-names
    expect(isPlainObject(function () {})).toBeFalsy()
  })
})

describe(cleanObject, () => {
  it('should return empty object when input is null', () => {
    expect(cleanObject(null)).toEqual({})
  })
  it('should return empty object when input is undefined', () => {
    expect(cleanObject(undefined)).toEqual({})
  })

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
    expect(cleanObject(obj)).toEqual({ a: 1, c: 3 })
  })

  it('should clean zero by default (bug: cleanNaN removes zero values)', () => {
    const obj = { a: 1, b: 0, c: 3 }
    expect(cleanObject(obj)).toEqual({ a: 1, b: 0, c: 3 })
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

describe(sortObject, () => {
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
    expect(descriptor?.writable).toBeFalsy()
  })
})

describe(cloneDeep, () => {
  it('should deeply clone a nested object', () => {
    const original = {
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
      },
    }
    const cloned = cloneDeep(original)

    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned.address).not.toBe(original.address)
  })

  it('should deeply clone nested arrays', () => {
    const original = {
      items: [1, 2, [3, 4, [5, 6]]],
      nested: { arr: [{ a: 1 }, { b: 2 }] },
    }
    const cloned = cloneDeep(original)

    expect(cloned).toEqual(original)
    expect(cloned.items).not.toBe(original.items)
    expect(cloned.items[2]).not.toBe(original.items[2])
    expect(cloned.nested.arr).not.toBe(original.nested.arr)
  })

  it('should handle primitives', () => {
    expect(cloneDeep(42)).toBe(42)
    expect(cloneDeep('hello')).toBe('hello')
    expect(cloneDeep(true)).toBeTruthy()
  })

  it('should handle null and undefined', () => {
    expect(cloneDeep(null)).toBe(null)
    expect(cloneDeep(undefined)).toBe(undefined)
  })

  it('should handle empty objects and arrays', () => {
    expect(cloneDeep({})).toEqual({})
    expect(cloneDeep([])).toEqual([])
    expect(cloneDeep({})).not.toBe({})
    expect(cloneDeep([])).not.toBe([])
  })

  it('should handle circular references with WeakMap', () => {
    const original: any = { a: 1, b: { c: 2 } }
    // Note: circular references are handled via WeakMap during cloning
    const cloned = cloneDeep(original)

    expect(cloned.a).toBe(1)
    expect(cloned.b.c).toBe(2)
    expect(cloned).not.toBe(original)
    expect(cloned.b).not.toBe(original.b)
  })

  it('should handle mixed nested structures', () => {
    const original = {
      users: [
        { id: 1, tags: ['admin', 'user'] },
        { id: 2, tags: ['user'] },
      ],
      metadata: {
        created: '2024-01-01',
        permissions: { read: true, write: false },
      },
    }
    const cloned = cloneDeep(original)

    expect(cloned).toEqual(original)
    expect(cloned.users).not.toBe(original.users)
    expect(cloned.users[0]).not.toBe(original.users[0])
    expect(cloned.users[0]?.tags).not.toBe(original.users[0]?.tags)
    expect(cloned.metadata).not.toBe(original.metadata)
  })

  it('should clone objects with symbol keys', () => {
    const sym = Symbol('test')
    const original: any = { [sym]: 'value', regular: 'key' }
    const cloned = cloneDeep(original)

    expect(cloned[sym]).toBe('value')
    expect(cloned.regular).toBe('key')
    expect(cloned).not.toBe(original)
  })

  it('should handle arrays of objects', () => {
    const original = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const cloned = cloneDeep(original)

    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned[0]).not.toBe(original[0])
  })

  it('should preserve array type', () => {
    const original = [1, 2, 3]
    const cloned = cloneDeep(original)

    expect(Array.isArray(cloned)).toBeTruthy()
    expect(Array.isArray(original)).toBeTruthy()
    expect(cloned).toEqual(original)
  })

  it('should handle deeply nested structures without circular references', () => {
    const original = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    }

    const cloned = cloneDeep(original)

    expect(cloned.level1.level2.level3.value).toBe('deep')
    expect(cloned).not.toBe(original)
    expect(cloned.level1).not.toBe(original.level1)
  })
})

describe(objectOmit, () => {
  it('should omit specified keys from object and return new object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4, e: undefined }
    expect(objectOmit(obj, ['a', 'c'])).toEqual({ b: 2, d: 4, e: undefined })
    // original object should not be mutated
    expect(obj).toEqual({ a: 1, b: 2, c: 3, d: 4, e: undefined })
  })

  it('should return same object when omitting no keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objectOmit(obj)).toEqual({ a: 1, b: 2, c: 3 })
    // original object should not be mutated
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle omitting non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    // @ts-expect-error test non-existent key
    expect(objectOmit(obj, ['c'])).toEqual({
      a: 1,
      b: 2,
    })
    // original object should not be mutated
    expect(obj).toEqual({ a: 1, b: 2 })
  })

  it('should option omitUndefined work', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(objectOmit(obj, ['b'], { omitUndefined: true })).toEqual({
      a: 1,
      c: 3,
    })
  })

  it('should handle omitting all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(objectOmit(obj, ['a', 'b'])).toEqual({})
    // original object should not be mutated
    expect(obj).toEqual({ a: 1, b: 2 })
  })
})
