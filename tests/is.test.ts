import { nanoid } from 'nanoid'
import { v4 as uuid } from 'uuid'
import { describe, expect, it } from 'vitest'
import {
  getObjectType,
  isAllEmpty,
  isArray,
  isBigInt,
  isBlob,
  isBoolean,
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
  isHTMLElement,
  isInteger,
  isIterable,
  isMap,
  isNaN,
  isNativePromise,
  isNil,
  isNanoID,
  isUUID,
  isNonEmptyArray,
  isNonEmptyString,
  isNull,
  isNullOrUndefined,
  isNumber,
  isNumbericString,
  isObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isTruthy,
  isUndefined,
  isUrlString,
  isWhitespaceString,
  isZero,
} from '../src/is'

describe(getObjectType, () => {
  it('should return correct object type', () => {
    expect(getObjectType({})).toBe('Object')
    expect(getObjectType([])).toBe('Array')
    expect(getObjectType(new Map())).toBe('Map')
    expect(getObjectType(new Set())).toBe('Set')
    expect(getObjectType(new Date())).toBe('Date')
    expect(getObjectType(/test/)).toBe('RegExp')
    expect(getObjectType(new Error('error'))).toBe('Error')
    expect(getObjectType(Promise.resolve())).toBe('Promise')
    expect(getObjectType(null)).toBe('Null')
    // @ts-expect-error testing undefined
    expect(getObjectType()).toBe('Undefined')
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

describe(isNumbericString, () => {
  it('should return true for numeric strings', () => {
    expect(isNumbericString('123')).toBeTruthy()
    expect(isNumbericString('0')).toBeTruthy()
    expect(isNumbericString('-123')).toBeTruthy()
    expect(isNumbericString('123.456')).toBeTruthy()
    expect(isNumbericString('1e10')).toBeTruthy()
  })

  it('should return false for non-numeric strings', () => {
    expect(isNumbericString('hello')).toBeFalsy()
    expect(isNumbericString('123abc')).toBeFalsy()
    expect(isNumbericString('')).toBeFalsy()
    expect(isNumbericString(' ')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isNumbericString(123)).toBeFalsy()
    expect(isNumbericString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isNumbericString()).toBeFalsy()
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
    // oxlint-disable-next-line func-names
    expect(isFunction(function () {})).toBeTruthy()
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
    expect(isRegExp(/test/)).toBeTruthy()
    // eslint-disable-next-line prefer-regex-literals
    expect(isRegExp(new RegExp('test'))).toBeTruthy()
  })

  it('should return false for non-RegExp values', () => {
    expect(isRegExp('/test/')).toBeFalsy()
    expect(isRegExp({})).toBeFalsy()
    expect(isRegExp(null)).toBeFalsy()
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

describe(isUrlString, () => {
  it('should return true for valid URL strings', () => {
    expect(isUrlString('http://example.com')).toBeTruthy()
    expect(isUrlString('https://example.com')).toBeTruthy()
    expect(isUrlString('https://example.com/path')).toBeTruthy()
    expect(isUrlString('https://example.com/path?query=1')).toBeTruthy()
    expect(isUrlString('ftp://example.com')).toBeTruthy()
  })

  it('should return false for invalid URL strings', () => {
    expect(isUrlString('not a url')).toBeFalsy()
    expect(isUrlString('example.com')).toBeFalsy()
    expect(isUrlString('/relative/path')).toBeFalsy()
    expect(isUrlString('')).toBeFalsy()
  })

  it('should return false for non-strings', () => {
    expect(isUrlString(123)).toBeFalsy()
    expect(isUrlString(null)).toBeFalsy()
    // @ts-expect-error testing undefined
    expect(isUrlString()).toBeFalsy()
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
