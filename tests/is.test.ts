import { describe, expect, it } from 'vitest'
import {
  getObjectType,
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

describe('getObjectType', () => {
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
    expect(getObjectType(undefined)).toBe('Undefined')
  })
})

describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
    expect(isUndefined('')).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined({})).toBe(false)
  })
})

describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
    expect(isNull('')).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull({})).toBe(false)
  })
})

describe('isNil', () => {
  it('should return true for null and undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil({})).toBe(false)
  })
})

describe('isNullOrUndefined', () => {
  it('should be an alias of isNil', () => {
    expect(isNullOrUndefined).toBe(isNil)
  })

  it('should return true for null and undefined', () => {
    expect(isNullOrUndefined(null)).toBe(true)
    expect(isNullOrUndefined(undefined)).toBe(true)
  })
})

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
    expect(isString(String('test'))).toBe(true)
  })

  it('should return false for non-strings', () => {
    expect(isString(123)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe('isEmptyString', () => {
  it('should return true for empty string', () => {
    expect(isEmptyString('')).toBe(true)
  })

  it('should return false for non-empty strings', () => {
    expect(isEmptyString('hello')).toBe(false)
    expect(isEmptyString(' ')).toBe(false)
    expect(isEmptyString('0')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isEmptyString(null)).toBe(false)
    expect(isEmptyString(undefined)).toBe(false)
    expect(isEmptyString(0)).toBe(false)
  })
})

describe('isNonEmptyString', () => {
  it('should return true for non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true)
    expect(isNonEmptyString(' ')).toBe(true)
    expect(isNonEmptyString('0')).toBe(true)
  })

  it('should return false for empty string', () => {
    expect(isNonEmptyString('')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isNonEmptyString(null)).toBe(false)
    expect(isNonEmptyString(undefined)).toBe(false)
  })
})

describe('isWhitespaceString', () => {
  it('should return true for whitespace strings', () => {
    expect(isWhitespaceString(' ')).toBe(true)
    expect(isWhitespaceString('  ')).toBe(true)
    expect(isWhitespaceString('\t')).toBe(true)
    expect(isWhitespaceString('\n')).toBe(true)
    expect(isWhitespaceString('\r\n')).toBe(true)
    expect(isWhitespaceString(' \t\n ')).toBe(true)
    expect(isWhitespaceString('')).toBe(true)
  })

  it('should return false for non-whitespace strings', () => {
    expect(isWhitespaceString('hello')).toBe(false)
    expect(isWhitespaceString(' hello ')).toBe(false)
    expect(isWhitespaceString('0')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isWhitespaceString(null)).toBe(false)
    expect(isWhitespaceString(undefined)).toBe(false)
  })
})

describe('isEmptyStringOrWhitespace', () => {
  it('should return true for empty or whitespace strings', () => {
    expect(isEmptyStringOrWhitespace('')).toBe(true)
    expect(isEmptyStringOrWhitespace(' ')).toBe(true)
    expect(isEmptyStringOrWhitespace('\t')).toBe(true)
    expect(isEmptyStringOrWhitespace('\n')).toBe(true)
  })

  it('should return false for non-empty non-whitespace strings', () => {
    expect(isEmptyStringOrWhitespace('hello')).toBe(false)
    expect(isEmptyStringOrWhitespace(' hello ')).toBe(false)
  })
})

describe('isNumbericString', () => {
  it('should return true for numeric strings', () => {
    expect(isNumbericString('123')).toBe(true)
    expect(isNumbericString('0')).toBe(true)
    expect(isNumbericString('-123')).toBe(true)
    expect(isNumbericString('123.456')).toBe(true)
    expect(isNumbericString('1e10')).toBe(true)
  })

  it('should return false for non-numeric strings', () => {
    expect(isNumbericString('hello')).toBe(false)
    expect(isNumbericString('123abc')).toBe(false)
    expect(isNumbericString('')).toBe(false)
    expect(isNumbericString(' ')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isNumbericString(123)).toBe(false)
    expect(isNumbericString(null)).toBe(false)
    expect(isNumbericString(undefined)).toBe(false)
  })
})

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(123)).toBe(true)
    expect(isNumber(-123)).toBe(true)
    expect(isNumber(123.456)).toBe(true)
    expect(isNumber(Infinity)).toBe(true)
    expect(isNumber(-Infinity)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(true)
  })

  it('should return false for non-numbers', () => {
    expect(isNumber('123')).toBe(false)
    expect(isNumber(true)).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
    expect(isNumber({})).toBe(false)
  })
})

describe('isZero', () => {
  it('should return true for zero', () => {
    expect(isZero(0)).toBe(true)
  })

  it('should return false for non-zero values', () => {
    expect(isZero(1)).toBe(false)
    expect(isZero(-1)).toBe(false)
    expect(isZero('0')).toBe(false)
    expect(isZero(false)).toBe(false)
    expect(isZero(null)).toBe(false)
  })
})

describe('isNaN', () => {
  it('should return true for NaN', () => {
    expect(isNaN(Number.NaN)).toBe(true)
    expect(isNaN(0 / 0)).toBe(true)
  })

  it('should return false for non-NaN values', () => {
    expect(isNaN(0)).toBe(false)
    expect(isNaN(123)).toBe(false)
    expect(isNaN('NaN')).toBe(false)
    expect(isNaN(undefined)).toBe(false)
    expect(isNaN(null)).toBe(false)
  })
})

describe('isInteger', () => {
  it('should return true for integers', () => {
    expect(isInteger(0)).toBe(true)
    expect(isInteger(123)).toBe(true)
    expect(isInteger(-123)).toBe(true)
  })

  it('should return false for non-integers', () => {
    expect(isInteger(123.456)).toBe(false)
    expect(isInteger(Infinity)).toBe(false)
    expect(isInteger(Number.NaN)).toBe(false)
    expect(isInteger('123')).toBe(false)
    expect(isInteger(null)).toBe(false)
  })
})

describe('isBigInt', () => {
  it('should return true for bigints', () => {
    expect(isBigInt(123n)).toBe(true)
    expect(isBigInt(123n)).toBe(true)
  })

  it('should return false for non-bigints', () => {
    expect(isBigInt(123)).toBe(false)
    expect(isBigInt('123')).toBe(false)
    expect(isBigInt(null)).toBe(false)
  })
})

describe('isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  it('should return false for non-booleans', () => {
    expect(isBoolean(1)).toBe(false)
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
  })
})

describe('isTruthy', () => {
  it('should return true for truthy values', () => {
    expect(isTruthy(true)).toBe(true)
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy('hello')).toBe(true)
    expect(isTruthy({})).toBe(true)
    expect(isTruthy([])).toBe(true)
  })

  it('should return false for falsy values', () => {
    expect(isTruthy(false)).toBe(false)
    expect(isTruthy(0)).toBe(false)
    expect(isTruthy('')).toBe(false)
    expect(isTruthy(null)).toBe(false)
    expect(isTruthy(undefined)).toBe(false)
    expect(isTruthy(Number.NaN)).toBe(false)
  })
})

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)

    expect(isFunction(class {})).toBe(true)
  })

  it('should return false for non-functions', () => {
    expect(isFunction({})).toBe(false)
    expect(isFunction([])).toBe(false)
    expect(isFunction(null)).toBe(false)
    expect(isFunction(undefined)).toBe(false)
  })
})

describe('isArray', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray([])).toBe(true)
  })

  it('should return false for non-arrays', () => {
    expect(isArray({})).toBe(false)
    expect(isArray('array')).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(undefined)).toBe(false)
  })
})

describe('isEmptyArray', () => {
  it('should return true for empty arrays', () => {
    expect(isEmptyArray([])).toBe(true)
  })

  it('should return false for non-empty arrays', () => {
    expect(isEmptyArray([1])).toBe(false)
    expect(isEmptyArray([1, 2, 3])).toBe(false)
  })

  it('should return false for non-arrays', () => {
    expect(isEmptyArray({})).toBe(false)
    expect(isEmptyArray(null)).toBe(false)
  })
})

describe('isNonEmptyArray', () => {
  it('should return true for non-empty arrays', () => {
    expect(isNonEmptyArray([1])).toBe(true)
    expect(isNonEmptyArray([1, 2, 3])).toBe(true)
  })

  it('should return false for empty arrays', () => {
    expect(isNonEmptyArray([])).toBe(false)
  })

  it('should return false for non-arrays', () => {
    expect(isNonEmptyArray({})).toBe(false)
    expect(isNonEmptyArray(null)).toBe(false)
  })
})

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(new Map())).toBe(true)
    expect(isObject(new Set())).toBe(true)
    expect(isObject(() => {})).toBe(true)
  })

  it('should return false for primitives and null', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(123)).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})

describe('isEmptyObject', () => {
  it('should return true for empty objects', () => {
    expect(isEmptyObject({})).toBe(true)
  })

  it('should return false for non-empty objects', () => {
    expect(isEmptyObject({ a: 1 })).toBe(false)
  })

  it('should return false for Map and Set', () => {
    expect(isEmptyObject(new Map())).toBe(false)
    expect(isEmptyObject(new Set())).toBe(false)
  })

  it('should return false for non-objects', () => {
    expect(isEmptyObject(null)).toBe(false)
    expect(isEmptyObject(undefined)).toBe(false)
  })

  it('should return true for empty arrays', () => {
    // Empty arrays are considered empty objects (they have no own properties)
    expect(isEmptyObject([])).toBe(true)
  })
})

describe('isMap', () => {
  it('should return true for Map instances', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new Map([['a', 1]]))).toBe(true)
  })

  it('should return false for non-Map values', () => {
    expect(isMap({})).toBe(false)
    expect(isMap(new Set())).toBe(false)
    expect(isMap([])).toBe(false)
    expect(isMap(null)).toBe(false)
  })
})

describe('isEmptyMap', () => {
  it('should return true for empty Maps', () => {
    expect(isEmptyMap(new Map())).toBe(true)
  })

  it('should return false for non-empty Maps', () => {
    const map = new Map([['a', 1]])
    expect(isEmptyMap(map)).toBe(false)
  })

  it('should return false for non-Maps', () => {
    expect(isEmptyMap({})).toBe(false)
    expect(isEmptyMap(null)).toBe(false)
  })
})

describe('isSet', () => {
  it('should return true for Set instances', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new Set([1, 2, 3]))).toBe(true)
  })

  it('should return false for non-Set values', () => {
    expect(isSet({})).toBe(false)
    expect(isSet(new Map())).toBe(false)
    expect(isSet([])).toBe(false)
    expect(isSet(null)).toBe(false)
  })
})

describe('isEmptySet', () => {
  it('should return true for empty Sets', () => {
    expect(isEmptySet(new Set())).toBe(true)
  })

  it('should return false for non-empty Sets', () => {
    const set = new Set([1, 2, 3])
    expect(isEmptySet(set)).toBe(false)
  })

  it('should return false for non-Sets', () => {
    expect(isEmptySet({})).toBe(false)
    expect(isEmptySet(null)).toBe(false)
  })
})

describe('isRegExp', () => {
  it('should return true for RegExp instances', () => {
    expect(isRegExp(/test/)).toBe(true)
    // eslint-disable-next-line prefer-regex-literals
    expect(isRegExp(new RegExp('test'))).toBe(true)
  })

  it('should return false for non-RegExp values', () => {
    expect(isRegExp('/test/')).toBe(false)
    expect(isRegExp({})).toBe(false)
    expect(isRegExp(null)).toBe(false)
  })
})

describe('isError', () => {
  it('should return true for Error instances', () => {
    expect(isError(new Error('error'))).toBe(true)
    expect(isError(new TypeError('error'))).toBe(true)
    expect(isError(new RangeError('error'))).toBe(true)
  })

  it('should return false for non-Error values', () => {
    expect(isError({})).toBe(false)
    expect(isError({ message: 'error' })).toBe(false)
    expect(isError(null)).toBe(false)
  })
})

describe('isNativePromise', () => {
  it('should return true for native Promise instances', () => {
    expect(isNativePromise(Promise.resolve())).toBe(true)
    // eslint-disable-next-line prefer-promise-reject-errors
    expect(isNativePromise(Promise.reject().catch(() => {}))).toBe(true)
    expect(isNativePromise(new Promise(() => {}))).toBe(true)
  })

  it('should return false for non-Promise values', () => {
    expect(isNativePromise({})).toBe(false)
    expect(isNativePromise({ then: () => {}, catch: () => {} })).toBe(false)
    expect(isNativePromise(null)).toBe(false)
  })
})

describe('isPromise', () => {
  it('should return true for Promise instances', () => {
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isPromise(new Promise(() => {}))).toBe(true)
  })

  it('should return true for promise-like objects', () => {
    const promiseLike = {
      then: () => {},
      catch: () => {},
    }
    expect(isPromise(promiseLike)).toBe(true)
  })

  it('should return false for non-promise values', () => {
    expect(isPromise({})).toBe(false)
    expect(isPromise({ then: () => {} })).toBe(false)
    expect(isPromise(null)).toBe(false)
  })
})

describe('isIterable', () => {
  it('should return true for iterable objects', () => {
    expect(isIterable([])).toBe(true)
    expect(isIterable('string')).toBe(true)
    expect(isIterable(new Map())).toBe(true)
    expect(isIterable(new Set())).toBe(true)
  })

  it('should return false for non-iterable values', () => {
    expect(isIterable({})).toBe(false)
    expect(isIterable(123)).toBe(false)
    expect(isIterable(null)).toBe(false)
    expect(isIterable(undefined)).toBe(false)
  })
})

describe('isBlob', () => {
  it('should return true for Blob instances', () => {
    const blob = new Blob(['test'])
    expect(isBlob(blob)).toBe(true)
  })

  it('should return false for non-Blob values', () => {
    expect(isBlob({})).toBe(false)
    expect(isBlob(null)).toBe(false)
  })
})

describe('isFormData', () => {
  it('should return true for FormData instances', () => {
    const formData = new FormData()
    expect(isFormData(formData)).toBe(true)
  })

  it('should return false for non-FormData values', () => {
    expect(isFormData({})).toBe(false)
    expect(isFormData(null)).toBe(false)
  })
})

describe('isFile', () => {
  it('should return true for File instances', () => {
    const file = new File(['test'], 'test.txt')
    expect(isFile(file)).toBe(true)
  })

  it('should return false for non-File values', () => {
    expect(isFile(new Blob(['test']))).toBe(false)
    expect(isFile({})).toBe(false)
    expect(isFile(null)).toBe(false)
  })
})

describe('isUrlString', () => {
  it('should return true for valid URL strings', () => {
    expect(isUrlString('http://example.com')).toBe(true)
    expect(isUrlString('https://example.com')).toBe(true)
    expect(isUrlString('https://example.com/path')).toBe(true)
    expect(isUrlString('https://example.com/path?query=1')).toBe(true)
    expect(isUrlString('ftp://example.com')).toBe(true)
  })

  it('should return false for invalid URL strings', () => {
    expect(isUrlString('not a url')).toBe(false)
    expect(isUrlString('example.com')).toBe(false)
    expect(isUrlString('/relative/path')).toBe(false)
    expect(isUrlString('')).toBe(false)
  })

  it('should return false for non-strings', () => {
    expect(isUrlString(123)).toBe(false)
    expect(isUrlString(null)).toBe(false)
    expect(isUrlString(undefined)).toBe(false)
  })
})

describe('isDeepEqual', () => {
  it('should return true for equal primitives', () => {
    expect(isDeepEqual(1, 1)).toBe(true)
    expect(isDeepEqual('test', 'test')).toBe(true)
    expect(isDeepEqual(true, true)).toBe(true)
    expect(isDeepEqual(null, null)).toBe(true)
    expect(isDeepEqual(undefined, undefined)).toBe(true)
  })

  it('should return false for different primitives', () => {
    expect(isDeepEqual(1, 2)).toBe(false)
    expect(isDeepEqual('test', 'test2')).toBe(false)
    expect(isDeepEqual(true, false)).toBe(false)
    expect(isDeepEqual(null, undefined)).toBe(false)
  })

  it('should return true for deeply equal arrays', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(isDeepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
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
    ).toBe(true)
  })

  it('should return false for different arrays', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false)
    expect(isDeepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
  })

  it('should return true for deeply equal objects', () => {
    expect(isDeepEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
  })

  it('should return false for different objects', () => {
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
  })

  it('should return false for different types', () => {
    expect(isDeepEqual(1, '1')).toBe(false)
    expect(isDeepEqual([], {})).toBe(false)
    expect(isDeepEqual(null, undefined)).toBe(false)
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
    expect(isDeepEqual(obj1, obj2)).toBe(true)
    expect(isDeepEqual(obj1, obj3)).toBe(false)
  })
})

describe('isHTMLElement', () => {
  it('should return false in Node.js environment', () => {
    // In Node.js environment, HTMLElement is not defined
    // The function will return false for any input
    expect(isHTMLElement({})).toBe(false)
    expect(isHTMLElement(null)).toBe(false)
    expect(isHTMLElement(undefined)).toBe(false)
  })

  // Note: In a browser environment with JSDOM, we could test with actual DOM elements
  // The isHTMLElement function requires Node and HTMLElement globals which are not available in Node.js
})
