// oxlint-disable unicorn/prefer-structured-clone

import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  cleanObject,
  cleanObjectInPlace,
  cloneDeep,
  deepMerge,
  deepMergeWithOptions,
  getIn,
  hasOwn,
  isKeyOf,
  isPlainObject,
  omit,
  omitInPlace,
  setIn,
  pick,
  sortObjectKeys,
  objectOmit,
} from '../src/object'

describe(pick, () => {
  it('should pick specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, ['a', 'c'])).toStrictEqual({ a: 1, c: 3 })
    expect(pick(obj, ['b', 'd'])).toStrictEqual({ b: 2, d: 4 })
  })

  it('should return empty object when picking empty array', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, [])).toStrictEqual({})
  })

  it('should ignore non-existent keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(pick(obj, ['a', 'e' as keyof typeof obj])).toStrictEqual({ a: 1 })
  })

  it('should pick from nested object', () => {
    const nested = { x: 1, y: { z: 2 }, w: 'test' }
    expect(pick(nested, ['x', 'y'])).toStrictEqual({ x: 1, y: { z: 2 } })
  })

  it('should handle picking all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a', 'b'])).toStrictEqual({ a: 1, b: 2 })
  })

  it('should create an own property when picking __proto__', () => {
    const obj = JSON.parse('{"__proto__":{"polluted":true}}') as Record<
      string,
      unknown
    >
    const result = pick(obj, ['__proto__'])

    expect(Object.hasOwn(result, '__proto__')).toBeTruthy()
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    expect(
      Object.getOwnPropertyDescriptor(result, '__proto__')?.value,
    ).toStrictEqual({ polluted: true })
    expect((result as { polluted?: boolean }).polluted).toBeUndefined()
  })
})

describe(omit, () => {
  it('should omit specified keys from a copy', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(omit(obj, ['a', 'c'])).toStrictEqual({ b: 2, d: 4 })
    expect(obj).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 })
  })

  it('should return a new object when omitting no keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj)
    expect(result).toStrictEqual(obj)
    expect(result).not.toBe(obj)
  })

  it('should handle omitting non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['c' as keyof typeof obj])).toStrictEqual({ a: 1, b: 2 })
  })

  it('should omit undefined values when requested', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(omit(obj, [], { omitUndefined: true })).toStrictEqual({
      a: 1,
      c: 3,
    })
  })

  it('should handle omitting all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['a', 'b'])).toStrictEqual({})
  })

  it('should preserve descriptors without invoking getters', () => {
    let getterCalls = 0
    const object = { a: 1 }
    Object.defineProperty(object, 'computed', {
      enumerable: true,
      get() {
        getterCalls++
        return 2
      },
    })

    const result = omit(object)
    expect(getterCalls).toBe(0)
    expect(Object.getOwnPropertyDescriptor(result, 'computed')?.get).toBe(
      Object.getOwnPropertyDescriptor(object, 'computed')?.get,
    )
  })

  it('should omit symbol keys without mutating the source', () => {
    const key = Symbol('key')
    const object = { [key]: true, visible: true }
    const result = omit(object, [key])

    expect(Reflect.ownKeys(result)).toStrictEqual(['visible'])
    expect(object[key]).toBeTruthy()
  })

  it('should omit non-configurable properties from frozen inputs', () => {
    const object = Object.freeze({ fixed: 1, visible: 2 })

    expect(omit(object, ['fixed'])).toStrictEqual({ visible: 2 })
    expect(omit(object, [], { omitUndefined: true })).toStrictEqual(object)
  })
})

describe(omitInPlace, () => {
  it('should mutate and return the source object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitInPlace(obj, 'b')
    expect(result).toBe(obj)
    expect(obj).toStrictEqual({ a: 1, c: 3 })
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

  it('should return false for undefined', () => {
    expect(hasOwn(undefined, 'key')).toBeFalsy()
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
    if (isKeyOf(obj, key)) {
      expectTypeOf(key).toEqualTypeOf<keyof typeof obj>()
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(obj[key]).toBe(1)
    }
  })

  it('should handle inherited properties', () => {
    const obj = Object.create({ inherited: 'value' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    obj.own = 'value'
    expect(isKeyOf(obj, 'own')).toBeTruthy()
    expect(isKeyOf(obj, 'inherited')).toBeTruthy()
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
    expect(isPlainObject(/regex/u)).toBeFalsy()
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
    expect(isPlainObject(Math.max)).toBeFalsy()
  })
})

describe(cleanObject, () => {
  it('should return empty object when input is null', () => {
    expect(cleanObject(null)).toStrictEqual({})
  })

  it('should return empty object when input is undefined', () => {
    expect(cleanObject(undefined)).toStrictEqual({})
  })

  it('should clean undefined by default', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, c: 3 })
  })

  it('should clean null by default', () => {
    const obj = { a: 1, b: null, c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, c: 3 })
  })

  it('should clean NaN by default', () => {
    const obj = { a: 1, b: Number.NaN, c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, c: 3 })
  })

  it('should not clean zero by default', () => {
    const obj = { a: 1, b: 0, c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, b: 0, c: 3 })
  })

  it('should clean zero when cleanZero is true', () => {
    const obj = { a: 1, b: 0, c: 3 }
    expect(cleanObject(obj, { cleanZero: true })).toStrictEqual({ a: 1, c: 3 })
  })

  it('should not clean empty string by default', () => {
    const obj = { a: 1, b: '', c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, b: '', c: 3 })
  })

  it('should clean empty string when cleanEmptyString is true', () => {
    const obj = { a: 1, b: '', c: 3 }
    expect(cleanObject(obj, { cleanEmptyString: true })).toStrictEqual({
      a: 1,
      c: 3,
    })
  })

  it('should not clean empty array by default', () => {
    const obj = { a: 1, b: [], c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, b: [], c: 3 })
  })

  it('should clean empty array when cleanEmptyArray is true', () => {
    const obj = { a: 1, b: [], c: 3 }
    expect(cleanObject(obj, { cleanEmptyArray: true })).toStrictEqual({
      a: 1,
      c: 3,
    })
  })

  it('should not clean empty object by default', () => {
    const obj = { a: 1, b: {}, c: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, b: {}, c: 3 })
  })

  it('should clean empty object when cleanEmptyObject is true', () => {
    const obj = { a: 1, b: {}, c: 3 }
    expect(cleanObject(obj, { cleanEmptyObject: true })).toStrictEqual({
      a: 1,
      c: 3,
    })
  })

  it('should only treat plain objects without own keys as empty objects', () => {
    const symbol = Symbol('value')
    const date = new Date(0)
    const obj = {
      array: [],
      date,
      empty: {},
      withSymbol: { [symbol]: true },
    }

    expect(
      cleanObject(obj, {
        cleanEmptyArray: false,
        cleanEmptyObject: true,
      }),
    ).toStrictEqual({
      array: [],
      date,
      withSymbol: { [symbol]: true },
    })
  })

  it('should not clean undefined when cleanUndefined is false', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(cleanObject(obj, { cleanUndefined: false })).toStrictEqual({
      a: 1,
      b: undefined,
      c: 3,
    })
  })

  it('should recursively clean nested objects by default', () => {
    const obj = { a: 1, b: { c: null, d: 2 }, e: 3 }
    expect(cleanObject(obj)).toStrictEqual({ a: 1, b: { d: 2 }, e: 3 })
  })

  it('should clean cyclic objects without overflowing the stack', () => {
    const obj: Record<string, unknown> = {
      nested: { remove: null, value: 1 },
      remove: undefined,
    }
    obj['self'] = obj

    const result = cleanObject(obj)
    expect(result).not.toBe(obj)
    expect(result['self']).toBe(result)
    expect(result).toStrictEqual({
      nested: { value: 1 },
      self: result,
    })
    expect(obj).toStrictEqual({
      nested: { remove: null, value: 1 },
      remove: undefined,
      self: obj,
    })
  })

  it('should not recursively clean when recursive is false', () => {
    const obj = { a: 1, b: { c: null, d: 2 }, e: 3 }
    expect(cleanObject(obj, { recursive: false })).toStrictEqual({
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
    ).toStrictEqual({ a: 1 })
  })

  it('should not mutate original object', () => {
    const obj = { a: 1, b: null, c: 3 }
    const result = cleanObject(obj)
    expect(result).not.toBe(obj)
    expect(obj).toStrictEqual({ a: 1, b: null, c: 3 })
  })

  it('should clean frozen objects without mutating their descriptors', () => {
    const obj = Object.freeze({ keep: 1, remove: null })
    const result = cleanObject(obj)

    expect(result).toStrictEqual({ keep: 1 })
    expect(obj).toStrictEqual({ keep: 1, remove: null })
  })
})

describe(cleanObjectInPlace, () => {
  it('should mutate and return the source object', () => {
    const obj = { a: 1, b: null, c: 3 }
    const result = cleanObjectInPlace(obj)
    expect(result).toBe(obj)
    expect(obj).toStrictEqual({ a: 1, c: 3 })
  })
})

describe(sortObjectKeys, () => {
  it('should sort object keys alphabetically', () => {
    const obj = { c: 3, a: 1, b: 2 }
    const result = sortObjectKeys(obj)
    expect(Object.keys(result)).toStrictEqual(['a', 'b', 'c'])
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty object', () => {
    const obj = {}
    expect(sortObjectKeys(obj)).toStrictEqual({})
  })

  it('should sort using custom compare function', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = sortObjectKeys(obj, {
      compareFn: (a, b) => b.localeCompare(a), // reverse order
    })
    expect(Object.keys(result)).toStrictEqual(['c', 'b', 'a'])
  })

  it('should not sort nested objects by default', () => {
    const obj = { c: 3, a: 1, nested: { z: 3, x: 1, y: 2 } }
    const result = sortObjectKeys(obj)
    expect(Object.keys(result)).toStrictEqual(['a', 'c', 'nested'])
    expect(Object.keys(result.nested)).toStrictEqual(['z', 'x', 'y'])
  })

  it('should sort nested objects when deep is true', () => {
    const obj = { c: 3, a: 1, nested: { z: 3, x: 1, y: 2 } }
    const result = sortObjectKeys(obj, { deep: true })
    expect(Object.keys(result)).toStrictEqual(['a', 'c', 'nested'])
    expect(Object.keys(result.nested)).toStrictEqual(['x', 'y', 'z'])
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
    const result = sortObjectKeys(obj, { deep: true })
    expect(Object.keys(result)).toStrictEqual(['a', 'z'])
    expect(Object.keys(result.a)).toStrictEqual(['b', 'c'])
    expect(Object.keys(result.a.b)).toStrictEqual(['x', 'y'])
  })

  it('should not modify arrays in values', () => {
    const obj = { c: [3, 2, 1], a: 1, b: 2 }
    const result = sortObjectKeys(obj)
    expect(result.c).toStrictEqual([3, 2, 1])
  })

  it('should preserve property descriptors', () => {
    const obj = { b: 2, a: 1 }
    Object.defineProperty(obj, 'c', {
      value: 3,
      enumerable: true,
      writable: false,
    })
    const result = sortObjectKeys(obj)
    const descriptor = Object.getOwnPropertyDescriptor(result, 'c')
    expect(descriptor?.writable).toBeFalsy()
  })

  it('should preserve accessors, non-enumerable keys, and symbols', () => {
    const symbol = Symbol('token')
    const expectedValue = 1
    const getter = () => expectedValue
    const obj = { z: 2, [symbol]: 3 }
    Object.defineProperty(obj, 'a', {
      configurable: true,
      enumerable: false,
      get: getter,
    })

    const result = sortObjectKeys(obj)

    expect(Reflect.ownKeys(result)).toStrictEqual(['a', 'z', symbol])
    expect(Object.getOwnPropertyDescriptor(result, 'a')?.get).toBe(getter)
    expect(result[symbol]).toBe(3)
  })

  it('should preserve circular and shared references when sorting deeply', () => {
    const shared = { z: 1, a: 2 }
    const obj: Record<string, unknown> = {
      right: shared,
      left: shared,
    }
    obj['self'] = obj

    const result = sortObjectKeys(obj, { deep: true })

    expect(result['self']).toBe(result)
    expect(result['left']).toBe(result['right'])
    expect(Object.keys(result['left'] as object)).toStrictEqual(['a', 'z'])
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

    expect(cloned).toStrictEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned.address).not.toBe(original.address)
  })

  it('should deeply clone nested arrays', () => {
    const original = {
      items: [1, 2, [3, 4, [5, 6]]],
      nested: { arr: [{ a: 1 }, { b: 2 }] },
    }
    const cloned = cloneDeep(original)

    expect(cloned).toStrictEqual(original)
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
    expect(cloneDeep(null)).toBeNull()
    expect(cloneDeep(undefined)).toBeUndefined()
  })

  it('should handle empty objects and arrays', () => {
    expect(cloneDeep({})).toStrictEqual({})
    expect(cloneDeep([])).toStrictEqual([])
    expect(cloneDeep({})).not.toBe({})
    expect(cloneDeep([])).not.toBe([])
  })

  it('should handle circular references with WeakMap', () => {
    const original: any = { a: 1, b: { c: 2 } }
    original.self = original
    original.b.parent = original

    const cloned = cloneDeep(original)

    expect(cloned.a).toBe(1)
    expect(cloned.b.c).toBe(2)
    expect(cloned).not.toBe(original)
    expect(cloned.b).not.toBe(original.b)
    expect(cloned.self).toBe(cloned)
    expect(cloned.b.parent).toBe(cloned)
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

    expect(cloned).toStrictEqual(original)
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

    expect(cloned).toStrictEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned[0]).not.toBe(original[0])
  })

  it('should preserve array type', () => {
    const original = [1, 2, 3]
    const cloned = cloneDeep(original)

    expect(Array.isArray(cloned)).toBeTruthy()
    expect(Array.isArray(original)).toBeTruthy()
    expect(cloned).toStrictEqual(original)
  })

  it('should clone dates, regular expressions, maps, and sets', () => {
    const key = { id: 1 }
    const original = {
      date: new Date('2024-01-01T00:00:00.000Z'),
      regexp: /value/giu,
      map: new Map([[key, { nested: true }]]),
      set: new Set([{ value: 1 }]),
    }
    original.regexp.lastIndex = 2

    const cloned = cloneDeep(original)

    expect(cloned).toStrictEqual(original)
    expect(cloned.date).not.toBe(original.date)
    expect(cloned.regexp).not.toBe(original.regexp)
    expect(cloned.map).not.toBe(original.map)
    expect([...cloned.map.keys()][0]).not.toBe(key)
    expect(cloned.set).not.toBe(original.set)
  })

  it('should clone built-in prototypes and attached descriptors', () => {
    class ModelDate extends Date {}

    const symbol = Symbol('metadata')
    const original = new ModelDate(0) as ModelDate & {
      metadata: { nested: boolean }
      [symbol]: string
    }
    Object.defineProperty(original, 'metadata', {
      configurable: false,
      enumerable: false,
      value: { nested: true },
      writable: false,
    })
    original[symbol] = 'token'

    const cloned = cloneDeep(original)

    expect(cloned).toBeInstanceOf(ModelDate)
    expect(cloned).not.toBe(original)
    expect(cloned.metadata).toStrictEqual({ nested: true })
    expect(cloned.metadata).not.toBe(original.metadata)
    expect(cloned[symbol]).toBe('token')
    expect(Object.getOwnPropertyDescriptor(cloned, 'metadata')).toMatchObject({
      configurable: false,
      enumerable: false,
      writable: false,
    })
  })

  it('should clone SharedArrayBuffer values and backed views', () => {
    const buffer = new SharedArrayBuffer(3)
    const view = new Uint8Array(buffer)
    view.set([1, 2, 3])

    const clonedBuffer = cloneDeep(buffer)
    const clonedView = cloneDeep(view)

    expect(clonedBuffer).not.toBe(buffer)
    expect([...new Uint8Array(clonedBuffer)]).toStrictEqual([1, 2, 3])
    expect(clonedView).not.toBe(view)
    expect(clonedView.buffer).not.toBe(buffer)
    expect([...clonedView]).toStrictEqual([1, 2, 3])
  })

  it('should preserve cycles between views and attached buffer metadata', () => {
    const buffer = new ArrayBuffer(3) as ArrayBuffer & {
      view: Uint8Array
    }
    const view = new Uint8Array(buffer)
    buffer.view = view

    const cloned = cloneDeep(view)

    expect(cloned).not.toBe(view)
    expect(cloned.buffer).not.toBe(buffer)
    expect((cloned.buffer as typeof buffer).view).toBe(cloned)
  })

  it('should preserve prototypes and property descriptors without invoking getters', () => {
    class Model {
      value = 1
    }
    const nested = true
    const getter = () => ({ nested })
    const original = new Model()
    Object.defineProperty(original, 'computed', {
      enumerable: false,
      get: getter,
    })

    const cloned = cloneDeep(original)

    expect(cloned).toBeInstanceOf(Model)
    expect(Object.getOwnPropertyDescriptor(cloned, 'computed')?.get).toBe(
      getter,
    )
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
    expect(objectOmit(obj, ['a', 'c'])).toStrictEqual({
      b: 2,
      d: 4,
      e: undefined,
    })
    // original object should not be mutated
    expect(obj).toStrictEqual({ a: 1, b: 2, c: 3, d: 4, e: undefined })
  })

  it('should return same object when omitting no keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objectOmit(obj)).toStrictEqual({ a: 1, b: 2, c: 3 })
    // original object should not be mutated
    expect(obj).toStrictEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle omitting non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    // @ts-expect-error test non-existent key
    expect(objectOmit(obj, ['c'])).toStrictEqual({
      a: 1,
      b: 2,
    })
    // original object should not be mutated
    expect(obj).toStrictEqual({ a: 1, b: 2 })
  })

  it('should option omitUndefined work', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    expect(objectOmit(obj, ['b'], { omitUndefined: true })).toStrictEqual({
      a: 1,
      c: 3,
    })
  })

  it('should handle omitting all keys', () => {
    const obj = { a: 1, b: 2 }
    expect(objectOmit(obj, ['a', 'b'])).toStrictEqual({})
    // original object should not be mutated
    expect(obj).toStrictEqual({ a: 1, b: 2 })
  })
})

describe(deepMerge, () => {
  it('should deep merge plain objects', () => {
    const result = deepMerge(
      { user: { name: 'Alice', tags: ['base'] }, enabled: true },
      { user: { name: 'Bob' } },
    )

    expect(result).toStrictEqual({
      user: { name: 'Bob', tags: ['base'] },
      enabled: true,
    })
  })

  it('should replace arrays by default', () => {
    const result = deepMerge(
      { list: [1, 2], config: { features: ['a'] } },
      { list: [3], config: { features: ['b'] } },
    )

    expect(result).toStrictEqual({
      list: [3],
      config: { features: ['b'] },
    })
  })

  it('should concat arrays with concat strategy', () => {
    const concatResult = deepMergeWithOptions(
      { arrayStrategy: 'concat' },
      { list: [1, 2], nested: { list: [3] } },
      { list: [4], nested: { list: [5] } },
    )

    expect(concatResult.list).toStrictEqual([1, 2, 4])
    expect(concatResult.nested.list).toStrictEqual([3, 5])
  })

  it('should treat an arrayStrategy field as data in deepMerge', () => {
    expect(deepMerge({ arrayStrategy: 'concat', list: [1] })).toStrictEqual({
      arrayStrategy: 'concat',
      list: [1],
    })
  })

  it('should safely merge special keys and cyclic records', () => {
    const source: Record<string, unknown> = { value: 1 }
    source['self'] = source
    const special = JSON.parse('{"__proto__":{"polluted":true}}') as Record<
      string,
      unknown
    >

    const cyclic = deepMerge(source)
    const merged = deepMerge({}, special)

    expect(cyclic['self']).toBe(cyclic)
    expect(Object.hasOwn(merged, '__proto__')).toBeTruthy()
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined()
  })

  it('should preserve references to earlier operands in the final graph', () => {
    const first: Record<string, unknown> = {}
    first['self'] = first

    const result = deepMerge(first, { reference: first })

    expect(result['self']).toBe(result)
    expect(result['reference']).toBe(result)
  })

  it('should concatenate arrays cloned from frozen operands', () => {
    const result = deepMergeWithOptions(
      { arrayStrategy: 'concat' },
      { list: Object.freeze([1]) },
      { list: [2] },
    )

    expect(result.list).toStrictEqual([1, 2])
  })

  it('should not mutate source objects', () => {
    const left = { nested: { count: 1 }, list: [1, 2] }
    const right = { nested: { count: 2 }, list: [3] }

    const result = deepMerge(left, right) as {
      nested: { count: number }
      list: number[]
    }

    expect(result).toStrictEqual({ nested: { count: 2 }, list: [3] })
    expect(left).toStrictEqual({ nested: { count: 1 }, list: [1, 2] })
    expect(right).toStrictEqual({ nested: { count: 2 }, list: [3] })
    expect(result.nested).not.toBe(left.nested)
    expect(result.list).not.toBe(right.list)
  })
})

describe(getIn, () => {
  const source = {
    user: {
      profile: {
        name: 'Alice',
      },
      roles: ['admin', 'editor'],
    },
  }

  it('should read nested value by dot path', () => {
    expect(getIn(source, 'user.profile.name')).toBe('Alice')
  })

  it('should read nested value by path array', () => {
    expect(getIn(source, ['user', 'roles', 1])).toBe('editor')
  })

  it('should return default value when path is missing', () => {
    expect(getIn(source, 'user.profile.age', { defaultValue: 18 })).toBe(18)
  })

  it('should support custom separator', () => {
    expect(getIn(source, 'user/profile/name', { separator: '/' })).toBe('Alice')
  })
})

describe(setIn, () => {
  it('should set nested value with createIntermediate by default', () => {
    const source = { user: {} }
    const result = setIn(source, 'user.profile.name', 'Alice') as {
      user: { profile: { name: string } }
    }

    expect(result.user.profile.name).toBe('Alice')
    expect(source).toStrictEqual({ user: {} })
  })

  it('should not create intermediate nodes when createIntermediate is false', () => {
    const source = { user: {} }
    const result = setIn(source, 'user.profile.name', 'Alice', {
      createIntermediate: false,
    })

    expect(result).toBe(source)
    expect(source).toStrictEqual({ user: {} })
  })

  it('should mutate original object when mutate is true', () => {
    const source = { user: { profile: { name: 'Alice' } } }
    const result = setIn(source, 'user.profile.name', 'Bob', {
      mutate: true,
    })

    expect(result).toBe(source)
    expect(source.user.profile.name).toBe('Bob')
  })

  it('should support array indexes in path', () => {
    const source = { users: [{ name: 'Alice' }] }
    const result = setIn(source, ['users', 0, 'name'], 'Bob') as {
      users: { name: string }[]
    }

    expect(result.users[0]!.name).toBe('Bob')
    expect(source.users[0]!.name).toBe('Alice')
  })

  it('should leave primitive intermediates unchanged when creation is disabled', () => {
    const source = { user: 1 }
    const result = setIn(source, 'user.name', 'Alice', {
      createIntermediate: false,
    })

    expect(result).toBe(source)
    expect(source).toStrictEqual({ user: 1 })
  })

  it('should reject prototype-polluting paths in immutable and mutable modes', () => {
    expect(() => setIn({}, '__proto__.polluted', true)).toThrow(TypeError)
    expect(() =>
      setIn({}, ['constructor', 'prototype', 'polluted'], true, {
        mutate: true,
      }),
    ).toThrow(TypeError)
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined()
  })
})
