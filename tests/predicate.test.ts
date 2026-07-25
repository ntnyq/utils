import { nanoid } from 'nanoid'
import { v4 as uuid } from 'uuid'
import { describe, expect, it } from 'vitest'
import {
  getObjectTag,
  isAllEmpty,
  isArray,
  isBigInt,
  isBlob,
  isBoolean,
  isDate,
  isDeepEqual,
  isEmptyArray,
  isEmptyMap,
  isEmptyObject,
  isEmptySet,
  isEmptyString,
  isEmptyStringOrWhitespace,
  isError,
  isFile,
  isFormData,
  isFunction,
  isInteger,
  isIterable,
  isMap,
  isNaN,
  isNativePromise,
  isNil,
  isNanoID,
  isUUID,
  isNonEmptyArray,
  isNonEmptyMap,
  isNonEmptyObject,
  isNonEmptySet,
  isNonEmptyString,
  isNull,
  isNullOrUndefined,
  isNumber,
  isNumericString,
  isObject,
  isPrimitive,
  isPromise,
  isRecord,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isTruthy,
  isUndefined,
  isURLString,
  isWeakMap,
  isWeakSet,
  isWhitespaceString,
  isZero,
} from '../src/predicate'
import { isHTMLElement } from '../src/web/dom'

describe(getObjectTag, () => {
  it('should return correct object type', () => {
    expect(getObjectTag({})).toBe('Object')
    expect(getObjectTag([])).toBe('Array')
    expect(getObjectTag(new Map())).toBe('Map')
    expect(getObjectTag(new Set())).toBe('Set')
    expect(getObjectTag(new Date())).toBe('Date')
    expect(getObjectTag(/test/u)).toBe('RegExp')
    expect(getObjectTag(new Error('error'))).toBe('Error')
    expect(getObjectTag(Promise.resolve())).toBe('Promise')
    expect(getObjectTag(null)).toBe('Null')
    // @ts-expect-error testing undefined
    expect(getObjectTag()).toBe('Undefined')
  })
})

describe(isUndefined, () => {
  it('should return true for undefined', () => {
    // @ts-expect-error testing undefined
    expect(isUndefined()).toBeTruthy()
  })

  it('should return false for other values', () => {
    expect(isUndefined(null)).toBeFalsy()
    expect(isUndefined(0)).toBeFalsy()
    expect(isUndefined('')).toBeFalsy()
    expect(isUndefined(false)).toBeFalsy()
    expect(isUndefined({})).toBeFalsy()
  })
})

describe(isNull, () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBeTruthy()
  })

  it('should return false for other values', () => {
    // @ts-expect-error testing undefined
    expect(isNull()).toBeFalsy()
    expect(isNull(0)).toBeFalsy()
    expect(isNull('')).toBeFalsy()
    expect(isNull(false)).toBeFalsy()
    expect(isNull({})).toBeFalsy()
  })
})

describe(isNil, () => {
  it('should return true for null and undefined', () => {
    expect(isNil(null)).toBeTruthy()
    // @ts-expect-error testing undefined
    expect(isNil()).toBeTruthy()
  })

  it('should return false for other values', () => {
    expect(isNil(0)).toBeFalsy()
    expect(isNil('')).toBeFalsy()
    expect(isNil(false)).toBeFalsy()
    expect(isNil({})).toBeFalsy()
  })
})

describe(isNullOrUndefined, () => {
  it('should be an alias of isNil', () => {
    expect(isNullOrUndefined).toBe(isNil)
  })

  it('should return true for null and undefined', () => {
    expect(isNullOrUndefined(null)).toBeTruthy()
    // @ts-expect-error testing undefined
    expect(isNullOrUndefined()).toBeTruthy()
  })
})

describe(isString, () => {
  it('should return true for strings', () => {
    expect(isString('')).toBeTruthy()
    expect(isString('hello')).toBeTruthy()
    expect(isString(String('test'))).toBeTruthy()
  })

  it('should return false for non-strings', () => {
    expect(isString(123)).toBeFalsy()
    expect(isString(true)).toBeFalsy()
    expect(isString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isString()).toBeFalsy()
    expect(isString({})).toBeFalsy()
  })
})

describe(isEmptyString, () => {
  it('should return true for empty string', () => {
    expect(isEmptyString('')).toBeTruthy()
  })

  it('should return false for non-empty strings', () => {
    expect(isEmptyString('hello')).toBeFalsy()
    expect(isEmptyString(' ')).toBeFalsy()
    expect(isEmptyString('0')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isEmptyString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isEmptyString()).toBeFalsy()
    expect(isEmptyString(0)).toBeFalsy()
  })
})

describe(isNonEmptyString, () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBeTruthy()
    expect(isNonEmptyString(' ')).toBeTruthy()
    expect(isNonEmptyString('0')).toBeTruthy()
  })

  it('should return false for empty string', () => {
    expect(isNonEmptyString('')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isNonEmptyString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isNonEmptyString()).toBeFalsy()
  })
})

describe(isWhitespaceString, () => {
  it('should return true for whitespace strings', () => {
    expect(isWhitespaceString(' ')).toBeTruthy()
    expect(isWhitespaceString('  ')).toBeTruthy()
    expect(isWhitespaceString('\t')).toBeTruthy()
    expect(isWhitespaceString('\n')).toBeTruthy()
    expect(isWhitespaceString('\r\n')).toBeTruthy()
    expect(isWhitespaceString(' \t\n ')).toBeTruthy()
    expect(isWhitespaceString('')).toBeTruthy()
  })

  it('should return false for non-whitespace strings', () => {
    expect(isWhitespaceString('hello')).toBeFalsy()
    expect(isWhitespaceString(' hello ')).toBeFalsy()
    expect(isWhitespaceString('0')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isWhitespaceString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isWhitespaceString()).toBeFalsy()
  })
})

describe(isEmptyStringOrWhitespace, () => {
  it('should return true for empty or whitespace strings', () => {
    expect(isEmptyStringOrWhitespace('')).toBeTruthy()
    expect(isEmptyStringOrWhitespace(' ')).toBeTruthy()
    expect(isEmptyStringOrWhitespace('\t')).toBeTruthy()
    expect(isEmptyStringOrWhitespace('\n')).toBeTruthy()
  })

  it('should return false for non-empty non-whitespace strings', () => {
    expect(isEmptyStringOrWhitespace('hello')).toBeFalsy()
    expect(isEmptyStringOrWhitespace(' hello ')).toBeFalsy()
  })
})

describe(isNumericString, () => {
  it('should return true for numeric strings', () => {
    expect(isNumericString('123')).toBeTruthy()
    expect(isNumericString('0')).toBeTruthy()
    expect(isNumericString('-123')).toBeTruthy()
    expect(isNumericString('123.456')).toBeTruthy()
    expect(isNumericString('1e10')).toBeTruthy()
  })

  it('should return false for non-numeric strings', () => {
    expect(isNumericString('hello')).toBeFalsy()
    expect(isNumericString('123abc')).toBeFalsy()
    expect(isNumericString('')).toBeFalsy()
    expect(isNumericString(' ')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isNumericString(123)).toBeFalsy()
    expect(isNumericString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isNumericString()).toBeFalsy()
  })
})

describe(isNumber, () => {
  it('should return true for numbers', () => {
    expect(isNumber(0)).toBeTruthy()
    expect(isNumber(123)).toBeTruthy()
    expect(isNumber(-123)).toBeTruthy()
    expect(isNumber(123.456)).toBeTruthy()
    expect(isNumber(Infinity)).toBeTruthy()
    expect(isNumber(-Infinity)).toBeTruthy()
    expect(isNumber(Number.NaN)).toBeTruthy()
  })

  it('should return false for non-numbers', () => {
    expect(isNumber('123')).toBeFalsy()
    expect(isNumber(true)).toBeFalsy()
    expect(isNumber(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isNumber()).toBeFalsy()
    expect(isNumber({})).toBeFalsy()
  })
})

describe(isZero, () => {
  it('should return true for zero', () => {
    expect(isZero(0)).toBeTruthy()
  })

  it('should return false for non-zero values', () => {
    expect(isZero(1)).toBeFalsy()
    expect(isZero(-1)).toBeFalsy()
    expect(isZero('0')).toBeFalsy()
    expect(isZero(false)).toBeFalsy()
    expect(isZero(null)).toBeFalsy()
  })
})

describe(isNaN, () => {
  it('should return true for NaN', () => {
    expect(isNaN(Number.NaN)).toBeTruthy()
    expect(isNaN(0 / 0)).toBeTruthy()
  })

  it('should return false for non-NaN values', () => {
    expect(isNaN(0)).toBeFalsy()
    expect(isNaN(123)).toBeFalsy()
    expect(isNaN('NaN')).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isNaN()).toBeFalsy()
    expect(isNaN(null)).toBeFalsy()
  })
})

describe(isInteger, () => {
  it('should return true for integers', () => {
    expect(isInteger(0)).toBeTruthy()
    expect(isInteger(123)).toBeTruthy()
    expect(isInteger(-123)).toBeTruthy()
  })

  it('should return false for non-integers', () => {
    expect(isInteger(123.456)).toBeFalsy()
    expect(isInteger(Infinity)).toBeFalsy()
    expect(isInteger(Number.NaN)).toBeFalsy()
    expect(isInteger('123')).toBeFalsy()
    expect(isInteger(null)).toBeFalsy()
  })
})

describe(isBigInt, () => {
  it('should return true for bigints', () => {
    expect(isBigInt(123n)).toBeTruthy()
    expect(isBigInt(123n)).toBeTruthy()
  })

  it('should return false for non-bigints', () => {
    expect(isBigInt(123)).toBeFalsy()
    expect(isBigInt('123')).toBeFalsy()
    expect(isBigInt(null)).toBeFalsy()
  })
})

describe(isSymbol, () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol('example'))).toBeTruthy()
    expect(isSymbol(Symbol.for('example'))).toBeTruthy()
    expect(isSymbol(Symbol.iterator)).toBeTruthy()
  })

  it('should return false for non-symbols', () => {
    const symbolObject = new Object(Symbol('example'))

    expect(isSymbol('symbol')).toBeFalsy()
    expect(isSymbol(symbolObject)).toBeFalsy()
    expect(isSymbol(null)).toBeFalsy()
    expect(isSymbol(undefined)).toBeFalsy()
  })
})

describe(isBoolean, () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBeTruthy()
    expect(isBoolean(false)).toBeTruthy()
  })

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBeFalsy()
    expect(isBoolean(0)).toBeFalsy()
    expect(isBoolean('true')).toBeFalsy()
    expect(isBoolean(null)).toBeFalsy()
  })
})

describe(isPrimitive, () => {
  it('should return true for primitive values', () => {
    expect(isPrimitive(null)).toBeTruthy()
    expect(isPrimitive(undefined)).toBeTruthy()
    expect(isPrimitive('hello')).toBeTruthy()
    expect(isPrimitive(123)).toBeTruthy()
    expect(isPrimitive(Number.NaN)).toBeTruthy()
    expect(isPrimitive(true)).toBeTruthy()
    expect(isPrimitive(Symbol('example'))).toBeTruthy()
    expect(isPrimitive(123n)).toBeTruthy()
  })

  it('should return false for objects and functions', () => {
    expect(isPrimitive({})).toBeFalsy()
    expect(isPrimitive([])).toBeFalsy()
    expect(isPrimitive(new Date())).toBeFalsy()
    expect(isPrimitive(() => {})).toBeFalsy()
  })
})

describe(isTruthy, () => {
  it('should return true for truthy values', () => {
    expect(isTruthy(true)).toBeTruthy()
    expect(isTruthy(1)).toBeTruthy()
    expect(isTruthy('hello')).toBeTruthy()
    expect(isTruthy({})).toBeTruthy()
    expect(isTruthy([])).toBeTruthy()
  })

  it('should return false for falsy values', () => {
    expect(isTruthy(false)).toBeFalsy()
    expect(isTruthy(0)).toBeFalsy()
    expect(isTruthy('')).toBeFalsy()
    expect(isTruthy(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isTruthy()).toBeFalsy()
    expect(isTruthy(Number.NaN)).toBeFalsy()
  })
})

describe(isFunction, () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBeTruthy()
    expect(isFunction(Math.max)).toBeTruthy()
    expect(isFunction(async () => {})).toBeTruthy()

    expect(isFunction(class {})).toBeTruthy()
  })

  it('should return false for non-functions', () => {
    expect(isFunction({})).toBeFalsy()
    expect(isFunction([])).toBeFalsy()
    expect(isFunction(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isFunction()).toBeFalsy()
  })
})

describe(isArray, () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBeTruthy()
    expect(isArray([1, 2, 3])).toBeTruthy()
    expect(isArray([])).toBeTruthy()
  })

  it('should return false for non-arrays', () => {
    expect(isArray({})).toBeFalsy()
    expect(isArray('array')).toBeFalsy()
    expect(isArray(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isArray()).toBeFalsy()
  })
})

describe(isEmptyArray, () => {
  it('should return true for empty arrays', () => {
    expect(isEmptyArray([])).toBeTruthy()
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmptyArray([1])).toBeFalsy()
    expect(isEmptyArray([1, 2, 3])).toBeFalsy()
  })

  it('should return false for non-arrays', () => {
    expect(isEmptyArray({})).toBeFalsy()
    expect(isEmptyArray(null)).toBeFalsy()
  })
})

describe(isNonEmptyArray, () => {
  it('should return true for non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBeTruthy()
    expect(isNonEmptyArray([1, 2, 3])).toBeTruthy()
  })

  it('should return false for empty arrays', () => {
    expect(isNonEmptyArray([])).toBeFalsy()
  })

  it('should return false for non-arrays', () => {
    expect(isNonEmptyArray({})).toBeFalsy()
    expect(isNonEmptyArray(null)).toBeFalsy()
  })
})

describe(isObject, () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBeTruthy()
    expect(isObject([])).toBeTruthy()
    expect(isObject(new Map())).toBeTruthy()
    expect(isObject(new Set())).toBeTruthy()
    expect(isObject(() => {})).toBeTruthy()
  })

  it('should return false for primitives and null', () => {
    expect(isObject(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isObject()).toBeFalsy()
    expect(isObject(123)).toBeFalsy()
    expect(isObject('string')).toBeFalsy()
    expect(isObject(true)).toBeFalsy()
  })
})

describe(isEmptyObject, () => {
  it('should return true for empty objects', () => {
    expect(isEmptyObject({})).toBeTruthy()
  })

  it('should return false for non-empty objects', () => {
    expect(isEmptyObject({ a: 1 })).toBeFalsy()
  })

  it('should return false for Map and Set', () => {
    expect(isEmptyObject(new Map())).toBeFalsy()
    expect(isEmptyObject(new Set())).toBeFalsy()
  })

  it('should return false for non-objects', () => {
    expect(isEmptyObject(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isEmptyObject()).toBeFalsy()
  })

  it('should return true for empty arrays', () => {
    // Empty arrays are considered empty objects (they have no own properties)
    expect(isEmptyObject([])).toBeTruthy()
  })
})

describe(isNonEmptyObject, () => {
  it('should return true for objects with own enumerable keys', () => {
    expect(isNonEmptyObject({ key: 'value' })).toBeTruthy()
    expect(isNonEmptyObject([1])).toBeTruthy()
  })

  it('should return false for empty objects and collections', () => {
    expect(isNonEmptyObject({})).toBeFalsy()
    expect(isNonEmptyObject([])).toBeFalsy()
    expect(isNonEmptyObject(new Map([['key', 'value']]))).toBeFalsy()
    expect(isNonEmptyObject(new Set([1]))).toBeFalsy()
    expect(isNonEmptyObject(null)).toBeFalsy()
  })
})

describe(isMap, () => {
  it('should return true for Map instances', () => {
    expect(isMap(new Map())).toBeTruthy()
    expect(isMap(new Map([['a', 1]]))).toBeTruthy()
  })

  it('should return false for non-Map values', () => {
    expect(isMap({})).toBeFalsy()
    expect(isMap(new Set())).toBeFalsy()
    expect(isMap([])).toBeFalsy()
    expect(isMap(null)).toBeFalsy()
  })
})

describe(isEmptyMap, () => {
  it('should return true for empty Maps', () => {
    expect(isEmptyMap(new Map())).toBeTruthy()
  })

  it('should return false for non-empty Maps', () => {
    const map = new Map([['a', 1]])
    expect(isEmptyMap(map)).toBeFalsy()
  })

  it('should return false for non-Maps', () => {
    expect(isEmptyMap({})).toBeFalsy()
    expect(isEmptyMap(null)).toBeFalsy()
  })
})

describe(isNonEmptyMap, () => {
  it('should return true for non-empty Maps', () => {
    expect(isNonEmptyMap(new Map([['key', 'value']]))).toBeTruthy()
  })

  it('should return false for empty Maps and other values', () => {
    expect(isNonEmptyMap(new Map())).toBeFalsy()
    expect(isNonEmptyMap(new Set([1]))).toBeFalsy()
    expect(isNonEmptyMap({ key: 'value' })).toBeFalsy()
    expect(isNonEmptyMap(null)).toBeFalsy()
  })
})

describe(isWeakMap, () => {
  it('should return true for WeakMap instances', () => {
    const key = {}

    expect(isWeakMap(new WeakMap([[key, 'value']]))).toBeTruthy()
    expect(isWeakMap(new WeakMap())).toBeTruthy()
  })

  it('should return false for non-WeakMap values', () => {
    expect(isWeakMap(new Map())).toBeFalsy()
    expect(isWeakMap({})).toBeFalsy()
    expect(isWeakMap(null)).toBeFalsy()
  })
})

describe(isSet, () => {
  it('should return true for Set instances', () => {
    expect(isSet(new Set())).toBeTruthy()
    expect(isSet(new Set([1, 2, 3]))).toBeTruthy()
  })

  it('should return false for non-Set values', () => {
    expect(isSet({})).toBeFalsy()
    expect(isSet(new Map())).toBeFalsy()
    expect(isSet([])).toBeFalsy()
    expect(isSet(null)).toBeFalsy()
  })
})

describe(isEmptySet, () => {
  it('should return true for empty Sets', () => {
    expect(isEmptySet(new Set())).toBeTruthy()
  })

  it('should return false for non-empty Sets', () => {
    const set = new Set([1, 2, 3])
    expect(isEmptySet(set)).toBeFalsy()
  })

  it('should return false for non-Sets', () => {
    expect(isEmptySet({})).toBeFalsy()
    expect(isEmptySet(null)).toBeFalsy()
  })
})

describe(isNonEmptySet, () => {
  it('should return true for non-empty Sets', () => {
    expect(isNonEmptySet(new Set([1]))).toBeTruthy()
  })

  it('should return false for empty Sets and other values', () => {
    expect(isNonEmptySet(new Set())).toBeFalsy()
    expect(isNonEmptySet(new Map([['key', 'value']]))).toBeFalsy()
    expect(isNonEmptySet([1])).toBeFalsy()
    expect(isNonEmptySet(null)).toBeFalsy()
  })
})

describe(isWeakSet, () => {
  it('should return true for WeakSet instances', () => {
    const value = {}

    expect(isWeakSet(new WeakSet([value]))).toBeTruthy()
    expect(isWeakSet(new WeakSet())).toBeTruthy()
  })

  it('should return false for non-WeakSet values', () => {
    expect(isWeakSet(new Set())).toBeFalsy()
    expect(isWeakSet({})).toBeFalsy()
    expect(isWeakSet(null)).toBeFalsy()
  })
})

describe(isAllEmpty, () => {
  it('should return true for all supported empty values', () => {
    expect(isAllEmpty(null)).toBeTruthy()
    // @ts-expect-error testing undefined
    expect(isAllEmpty()).toBeTruthy()
    expect(isAllEmpty(undefined)).toBeTruthy()
    expect(isAllEmpty('')).toBeTruthy()
    expect(isAllEmpty([])).toBeTruthy()
    expect(isAllEmpty({})).toBeTruthy()
    expect(isAllEmpty(new Set())).toBeTruthy()
    expect(isAllEmpty(new Map())).toBeTruthy()
  })

  it('should return false for non-empty values', () => {
    expect(isAllEmpty(' ')).toBeFalsy()
    expect(isAllEmpty([1])).toBeFalsy()
    expect(isAllEmpty({ a: 1 })).toBeFalsy()
    expect(isAllEmpty(new Set([1]))).toBeFalsy()
    expect(isAllEmpty(new Map([['a', 1]]))).toBeFalsy()
    expect(isAllEmpty(0)).toBeFalsy()
    expect(isAllEmpty(false)).toBeFalsy()
  })
})

describe(isRegExp, () => {
  it('should return true for RegExp instances', () => {
    expect(isRegExp(/test/u)).toBeTruthy()
    // eslint-disable-next-line prefer-regex-literals
    expect(isRegExp(new RegExp('test', 'u'))).toBeTruthy()
  })

  it('should return false for non-RegExp values', () => {
    expect(isRegExp('/test/')).toBeFalsy()
    expect(isRegExp({})).toBeFalsy()
    expect(isRegExp(null)).toBeFalsy()
  })
})

describe(isDate, () => {
  it('should return true for Date instances', () => {
    expect(isDate(new Date())).toBeTruthy()
    expect(isDate(new Date('invalid'))).toBeTruthy()
  })

  it('should return false for non-Date values', () => {
    expect(isDate(Date.now())).toBeFalsy()
    expect(isDate('2026-07-17')).toBeFalsy()
    expect(isDate({})).toBeFalsy()
    expect(isDate(null)).toBeFalsy()
  })
})

describe(isError, () => {
  it('should return true for Error instances', () => {
    expect(isError(new Error('error'))).toBeTruthy()
    expect(isError(new TypeError('error'))).toBeTruthy()
    expect(isError(new RangeError('error'))).toBeTruthy()
  })

  it('should return false for non-Error values', () => {
    expect(isError({})).toBeFalsy()
    expect(isError({ message: 'error' })).toBeFalsy()
    expect(isError(null)).toBeFalsy()
  })
})

describe(isNativePromise, () => {
  it('should return true for native Promise instances', () => {
    expect(isNativePromise(Promise.resolve())).toBeTruthy()
    // eslint-disable-next-line prefer-promise-reject-errors, promise/prefer-await-to-then
    expect(isNativePromise(Promise.reject().catch(() => {}))).toBeTruthy()
    // oxlint-disable-next-line promise/avoid-new
    expect(isNativePromise(new Promise(() => {}))).toBeTruthy()
  })

  it('should return false for non-Promise values', () => {
    expect(isNativePromise({})).toBeFalsy()
    // oxlint-disable-next-line unicorn/no-thenable
    expect(isNativePromise({ then: () => {}, catch: () => {} })).toBeFalsy()
    expect(isNativePromise(null)).toBeFalsy()
  })
})

describe(isPromise, () => {
  it('should return true for Promise instances', () => {
    expect(isPromise(Promise.resolve())).toBeTruthy()
    // oxlint-disable-next-line promise/avoid-new
    expect(isPromise(new Promise(() => {}))).toBeTruthy()
  })

  it('should return true for promise-like objects', () => {
    const promiseLike = {
      // oxlint-disable-next-line unicorn/no-thenable
      then: () => {},
      catch: () => {},
    }
    expect(isPromise(promiseLike)).toBeTruthy()
  })

  it('should return false for non-promise values', () => {
    expect(isPromise({})).toBeFalsy()
    // oxlint-disable-next-line unicorn/no-thenable
    expect(isPromise({ then: () => {} })).toBeFalsy()
    expect(isPromise(null)).toBeFalsy()
  })
})

describe(isIterable, () => {
  it('should return true for iterable objects', () => {
    expect(isIterable([])).toBeTruthy()
    expect(isIterable('string')).toBeTruthy()
    expect(isIterable(new Map())).toBeTruthy()
    expect(isIterable(new Set())).toBeTruthy()
  })

  it('should return false for non-iterable values', () => {
    expect(isIterable({})).toBeFalsy()
    expect(isIterable(123)).toBeFalsy()
    expect(isIterable(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isIterable()).toBeFalsy()
  })
})

describe(isBlob, () => {
  it('should return true for Blob instances', () => {
    const blob = new Blob(['test'])
    expect(isBlob(blob)).toBeTruthy()
  })

  it('should return false for non-Blob values', () => {
    expect(isBlob({})).toBeFalsy()
    expect(isBlob(null)).toBeFalsy()
  })
})

describe(isFormData, () => {
  it('should return true for FormData instances', () => {
    const formData = new FormData()
    expect(isFormData(formData)).toBeTruthy()
  })

  it('should return false for non-FormData values', () => {
    expect(isFormData({})).toBeFalsy()
    expect(isFormData(null)).toBeFalsy()
  })
})

describe(isFile, () => {
  it('should return true for File instances', () => {
    const file = new File(['test'], 'test.txt')
    expect(isFile(file)).toBeTruthy()
  })

  it('should return false for non-File values', () => {
    expect(isFile(new Blob(['test']))).toBeFalsy()
    expect(isFile({})).toBeFalsy()
    expect(isFile(null)).toBeFalsy()
  })
})

describe(isURLString, () => {
  it('should return true for valid URL strings', () => {
    expect(isURLString('http://example.com')).toBeTruthy()
    expect(isURLString('https://example.com')).toBeTruthy()
    expect(isURLString('https://example.com/path')).toBeTruthy()
    expect(isURLString('https://example.com/path?query=1')).toBeTruthy()
    expect(isURLString('ftp://example.com')).toBeTruthy()
  })

  it('should return false for invalid URL strings', () => {
    expect(isURLString('not a url')).toBeFalsy()
    expect(isURLString('example.com')).toBeFalsy()
    expect(isURLString('/relative/path')).toBeFalsy()
    expect(isURLString('')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isURLString(123)).toBeFalsy()
    expect(isURLString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isURLString()).toBeFalsy()
  })
})

describe(isDeepEqual, () => {
  it('should return true for equal primitives', () => {
    expect(isDeepEqual(1, 1)).toBeTruthy()
    expect(isDeepEqual('test', 'test')).toBeTruthy()
    expect(isDeepEqual(true, true)).toBeTruthy()
    expect(isDeepEqual(null, null)).toBeTruthy()
    // @ts-expect-error testing undefined
    expect(isDeepEqual()).toBeTruthy()
  })

  it('should return false for different primitives', () => {
    expect(isDeepEqual(1, 2)).toBeFalsy()
    expect(isDeepEqual('test', 'test2')).toBeFalsy()
    expect(isDeepEqual(true, false)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isDeepEqual(null)).toBeFalsy()
  })

  it('should return true for deeply equal arrays', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBeTruthy()
    expect(isDeepEqual([{ a: 1 }], [{ a: 1 }])).toBeTruthy()
    expect(
      isDeepEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 4],
        ],
      ),
    ).toBeTruthy()
  })

  it('should return false for different arrays', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 4])).toBeFalsy()
    expect(isDeepEqual([1, 2], [1, 2, 3])).toBeFalsy()
    expect(isDeepEqual([{ a: 1 }], [{ a: 2 }])).toBeFalsy()
  })

  it('should return true for deeply equal objects', () => {
    expect(isDeepEqual({ a: 1 }, { a: 1 })).toBeTruthy()
    expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBeTruthy()
  })

  it('should return false for different objects', () => {
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBeFalsy()
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBeFalsy()
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBeFalsy()
  })

  it('should return false for different types', () => {
    expect(isDeepEqual(1, '1')).toBeFalsy()
    expect(isDeepEqual([], {})).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isDeepEqual(null)).toBeFalsy()
  })

  it('should handle complex nested structures', () => {
    const obj1 = {
      a: [1, 2, { b: 3 }],
      c: { d: [4, 5, 6] },
    }
    const obj2 = {
      a: [1, 2, { b: 3 }],
      c: { d: [4, 5, 6] },
    }
    const obj3 = {
      a: [1, 2, { b: 4 }],
      c: { d: [4, 5, 6] },
    }
    expect(isDeepEqual(obj1, obj2)).toBeTruthy()
    expect(isDeepEqual(obj1, obj3)).toBeFalsy()
  })

  it('should compare symbol keys', () => {
    const sym = Symbol('token')

    expect(isDeepEqual({ [sym]: 1 }, { [sym]: 1 })).toBeTruthy()
    expect(isDeepEqual({ [sym]: 1 }, { [sym]: 2 })).toBeFalsy()
    expect(isDeepEqual({ [sym]: 1 }, {})).toBeFalsy()
  })

  it('should compare dates, regular expressions, maps, and sets by value', () => {
    expect(
      isDeepEqual(
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-01-02T00:00:00.000Z'),
      ),
    ).toBeFalsy()
    expect(isDeepEqual(/a/giu, /b/giu)).toBeFalsy()
    expect(
      isDeepEqual(
        new Map([[{ id: 1 }, { value: 2 }]]),
        new Map([[{ id: 1 }, { value: 2 }]]),
      ),
    ).toBeTruthy()
    expect(isDeepEqual(new Set([{ id: 1 }]), new Set([{ id: 2 }]))).toBeFalsy()
  })

  it('should compare attached properties on supported built-ins', () => {
    const left = new Date(0) as Date & { metadata: { value: number } }
    const right = new Date(0) as Date & { metadata: { value: number } }
    left.metadata = { value: 1 }
    right.metadata = { value: 2 }

    expect(isDeepEqual(left, right)).toBeFalsy()
    right.metadata.value = 1
    expect(isDeepEqual(left, right)).toBeTruthy()
  })

  it('should compare SharedArrayBuffer values by bytes', () => {
    const left = new SharedArrayBuffer(2)
    const equal = new SharedArrayBuffer(2)
    const different = new SharedArrayBuffer(2)
    new Uint8Array(left).set([1, 2])
    new Uint8Array(equal).set([1, 2])
    new Uint8Array(different).set([1, 3])

    expect(isDeepEqual(left, equal)).toBeTruthy()
    expect(isDeepEqual(left, different)).toBeFalsy()
    expect(isDeepEqual(left, new SharedArrayBuffer(3))).toBeFalsy()
  })

  it('should only consider opaque built-ins equal by identity', () => {
    const promise = Promise.resolve(1)
    const weakMap = new WeakMap()
    const url = new URL('https://example.com/one')

    expect(isDeepEqual(promise, promise)).toBeTruthy()
    expect(isDeepEqual(promise, Promise.resolve(1))).toBeFalsy()
    expect(isDeepEqual(weakMap, weakMap)).toBeTruthy()
    expect(isDeepEqual(weakMap, new WeakMap())).toBeFalsy()
    expect(isDeepEqual(url, url)).toBeTruthy()
    expect(isDeepEqual(url, new URL('https://example.com/two'))).toBeFalsy()
  })

  it('should compare cyclic graphs without overflowing the stack', () => {
    const left: Record<string, unknown> = { value: 1 }
    const right: Record<string, unknown> = { value: 1 }
    left['self'] = left
    right['self'] = right

    expect(isDeepEqual(left, right)).toBeTruthy()

    const different: Record<string, unknown> = { value: 1 }
    different['self'] = { value: 1, self: different }
    expect(isDeepEqual(left, different)).toBeFalsy()
  })

  it('should only consider the same function reference equal', () => {
    const value = 1
    const fn = () => value
    expect(isDeepEqual(fn, fn)).toBeTruthy()
    expect(
      isDeepEqual(
        () => 1,
        () => 1,
      ),
    ).toBeFalsy()
  })
})

describe(isRecord, () => {
  it('should return true for plain objects and functions', () => {
    expect(isRecord({})).toBeTruthy()
    expect(isRecord({ a: 1 })).toBeTruthy()
    expect(isRecord(() => {})).toBeTruthy()
  })

  it('should return false for arrays and nullish values', () => {
    expect(isRecord([])).toBeFalsy()
    expect(isRecord(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isRecord()).toBeFalsy()
  })
})

describe(isHTMLElement, () => {
  it('should return false in Node.js environment', () => {
    // In Node.js environment, HTMLElement is not defined
    // The function will return false for any input
    expect(isHTMLElement({})).toBeFalsy()
    expect(isHTMLElement(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isHTMLElement()).toBeFalsy()
  })

  // Note: In a browser environment with JSDOM, we could test with actual DOM elements
  // The isHTMLElement function requires Node and HTMLElement globals which are not available in Node.js
})

describe(isNanoID, () => {
  it('should return true for valid NanoID strings', () => {
    expect(isNanoID('V1StGXR8_Z5jdHi6B-myT')).toBeTruthy()
    // cSpell: disable-next-line
    expect(isNanoID('v1stgxr8_z5jdhI6b-myt')).toBeTruthy()
  })

  it('should return false for invalid NanoID strings', () => {
    expect(isNanoID('')).toBeFalsy()
    expect(isNanoID('short')).toBeFalsy()
    expect(isNanoID('this-is-not-a-nanoid')).toBeFalsy()
    expect(isNanoID(123)).toBeFalsy()
    expect(isNanoID(null)).toBeFalsy()
  })

  it('should return true for 100 generated NanoID strings', () => {
    const ONE_HUNDRED_NANO_IDS = Array.from({ length: 100 }, () => nanoid())

    ONE_HUNDRED_NANO_IDS.forEach(id => {
      expect(isNanoID(id)).toBeTruthy()
    })
  })
})

describe(isUUID, () => {
  it('should return true for valid UUID strings', () => {
    expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBeTruthy()
    expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBeTruthy()
  })

  it('should return false for invalid UUID strings', () => {
    expect(isUUID('')).toBeFalsy()
    expect(isUUID('not-a-uuid')).toBeFalsy()
    // too short
    expect(isUUID('123e4567-e89b-12d3-a456-42661417400')).toBeFalsy()
    // too long
    expect(isUUID('123e4567-e89b-12d3-a456-4266141740000')).toBeFalsy()
    expect(isUUID(123)).toBeFalsy()
    expect(isUUID(null)).toBeFalsy()
  })

  it('should return true for 100 generated UUID strings', () => {
    const ONE_HUNDRED_UUIDS = Array.from({ length: 100 }, () => uuid())

    ONE_HUNDRED_UUIDS.forEach(id => {
      expect(isUUID(id)).toBeTruthy()
    })
  })
})
