// oxlint-disable oxc/approx-constant
import { describe, expect, it, vi } from 'vitest'
import {
  clamp,
  digitsToChinese,
  randomInteger,
  round,
  toChineseNumber,
  toFixed,
  toInteger,
  toNumber,
} from '../src/number'

describe(digitsToChinese, () => {
  it('should convert each digit independently', () => {
    expect(digitsToChinese(2026)).toBe('二零二六')
    expect(digitsToChinese('020-1234.5')).toBe('零二零-一二三四.五')
  })

  it('should preserve non-digit characters', () => {
    expect(digitsToChinese('version two')).toBe('version two')
    expect(digitsToChinese('-10°C')).toBe('-一零°C')
  })
})

describe(toChineseNumber, () => {
  it('should convert integers smaller than ten thousand', () => {
    expect(toChineseNumber(0)).toBe('零')
    expect(toChineseNumber(9)).toBe('九')
    expect(toChineseNumber(10)).toBe('十')
    expect(toChineseNumber(11)).toBe('十一')
    expect(toChineseNumber(20)).toBe('二十')
    expect(toChineseNumber(101)).toBe('一百零一')
    expect(toChineseNumber(110)).toBe('一百一十')
    expect(toChineseNumber(1001)).toBe('一千零一')
    expect(toChineseNumber(1024)).toBe('一千零二十四')
  })

  it('should place zeros across four-digit groups', () => {
    expect(toChineseNumber(10_000)).toBe('一万')
    expect(toChineseNumber(10_001)).toBe('一万零一')
    expect(toChineseNumber(10_010)).toBe('一万零一十')
    expect(toChineseNumber(100_000_000)).toBe('一亿')
    expect(toChineseNumber(100_010_001)).toBe('一亿零一万零一')
    expect(toChineseNumber(1_000_010_001)).toBe('十亿零一万零一')
  })

  it('should convert negative integers', () => {
    expect(toChineseNumber(-2026)).toBe('负二千零二十六')
  })

  it('should support the safe integer boundary', () => {
    expect(toChineseNumber(Number.MAX_SAFE_INTEGER)).toBe(
      '九千零七万亿一千九百九十二亿五千四百七十四万零九百九十一',
    )
  })

  it('should reject values that are not safe integers', () => {
    expect(() => toChineseNumber(1.5)).toThrow(TypeError)
    expect(() => toChineseNumber(Number.NaN)).toThrow(TypeError)
    expect(() => toChineseNumber(Number.POSITIVE_INFINITY)).toThrow(TypeError)
    expect(() => toChineseNumber(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      TypeError,
    )
  })
})

describe(randomInteger, () => {
  it('should return a number within the specified range', () => {
    const max = 10
    const min = 1
    const result = randomInteger(min, max)

    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThan(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should handle single argument (max only)', () => {
    const max = 5
    const result = randomInteger(max)

    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should swap min and max when min > max', () => {
    const max = 1
    const min = 10
    const result = randomInteger(min, max)

    expect(result).toBeGreaterThanOrEqual(max)
    expect(result).toBeLessThan(min)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should include max value when includeMax is true', () => {
    const max = 2
    const min = 1
    const results = new Set()

    // Generate many results to test probability
    for (let i = 0; i < 1000; i++) {
      const result = randomInteger(min, max, { includeMax: true })
      results.add(result)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThanOrEqual(max)
      expect(Number.isInteger(result)).toBeTruthy()
    }

    // Should generate both min and max values
    expect(results.has(min)).toBeTruthy()
    expect(results.has(max)).toBeTruthy()
  })

  it('should not include max value when includeMax is false (default)', () => {
    const max = 2
    const min = 1
    const results = new Set()

    // Generate many results to test probability
    for (let i = 0; i < 1000; i++) {
      const result = randomInteger(min, max, { includeMax: false })
      results.add(result)
      expect(result).toBeGreaterThanOrEqual(min)
      expect(result).toBeLessThan(max)
      expect(Number.isInteger(result)).toBeTruthy()
    }

    // Should only generate min value, not max
    expect(results.has(min)).toBeTruthy()
    expect(results.has(max)).toBeFalsy()
  })

  it('should handle equal min and max values', () => {
    const value = 5
    const result = randomInteger(value, value)

    expect(result).toBe(value)
  })

  it('should handle equal min and max values with includeMax', () => {
    const value = 5
    const result = randomInteger(value, value, { includeMax: true })

    expect(result).toBe(value)
  })

  it('should handle negative numbers', () => {
    const min = -10
    const max = -1
    const result = randomInteger(min, max)

    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThanOrEqual(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should handle zero as min or max', () => {
    const result1 = randomInteger(0, 5)
    expect(result1).toBeGreaterThanOrEqual(0)
    expect(result1).toBeLessThanOrEqual(5)

    const result2 = randomInteger(-5, 0)
    expect(result2).toBeGreaterThanOrEqual(-5)
    expect(result2).toBeLessThanOrEqual(0)
  })

  it('should return consistent type (integer)', () => {
    const max = 5.7
    const min = 1.5
    const result = randomInteger(min, max)

    expect(Number.isInteger(result)).toBeTruthy()
    expect(result).toBeGreaterThanOrEqual(Math.floor(min))
    expect(result).toBeLessThanOrEqual(Math.floor(max))
  })

  it('should work with decimal inputs and truncate to integer', () => {
    const max = 3.1
    const min = 1.9
    const result = randomInteger(min, max)

    expect(Number.isInteger(result)).toBeTruthy()
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(3)
  })

  it('should honor exclusive bounds for negative ranges', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999_999)
    expect(randomInteger(-5, -1)).toBe(-2)

    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999_999)
    expect(randomInteger(-5, -1, { includeMax: true })).toBe(-1)
    vi.restoreAllMocks()
  })

  it('should reject invalid or empty integer ranges', () => {
    expect(() => randomInteger(Number.POSITIVE_INFINITY, 2)).toThrow(RangeError)
    expect(() => randomInteger(1.1, 1.2)).toThrow(RangeError)
  })
})

describe(toInteger, () => {
  it('should convert number to integer', () => {
    expect(toInteger(42)).toBe(42)
    expect(toInteger(3.14, { allowDecimal: true })).toBe(3)
    expect(toInteger(-2.9, { allowDecimal: true })).toBe(-2)
    expect(toInteger(5)).toBe(5) // 5 is an integer
  })

  it('should convert string to integer', () => {
    expect(toInteger('42')).toBe(42)
    expect(toInteger('3.14', { allowDecimal: true })).toBe(3)
    expect(toInteger('-2.9', { allowDecimal: true })).toBe(-2)
    expect(toInteger('  123  ')).toBe(123)
  })

  it('should handle empty string', () => {
    expect(toInteger('')).toBe(0)
    expect(toInteger('  ')).toBe(0)
    expect(toInteger('', { defaultValue: 99 })).toBe(99)
  })

  it('should handle null and undefined', () => {
    expect(toInteger(null)).toBe(0)
    expect(toInteger(undefined)).toBe(0)
    expect(toInteger(null, { onError: 'useDefault', defaultValue: 42 })).toBe(
      42,
    )
    expect(
      toInteger(undefined, { onError: 'useDefault', defaultValue: 42 }),
    ).toBe(42)
  })

  it('should handle NaN', () => {
    expect(toInteger('not a number')).toBe(0) // returns defaultValue
    expect(toInteger('abc', { defaultValue: 10 })).toBe(10)
    expect(toInteger(Number.NaN, { allowNaN: true })).toBeNaN()
    expect(toInteger('abc', { allowNaN: true })).toBe(Number.NaN) // still returns defaultValue for string conversion
  })

  it('should handle allowDecimal option', () => {
    expect(toInteger(3.14, { allowDecimal: true })).toBe(3)
    expect(toInteger(3.14, { allowDecimal: false })).toBe(0)
    expect(toInteger(3.14, { allowDecimal: false, defaultValue: 99 })).toBe(99)
  })

  it('should handle onError option', () => {
    expect(() => toInteger('', { onError: 'throwError' })).toThrow(
      /empty string/u,
    )
    expect(() => toInteger(null, { onError: 'throwError' })).toThrow(/null/u)
    expect(() => toInteger('abc', { onError: 'throwError' })).toThrow(/nan/iu)

    expect(toInteger('', { onError: 'returnOriginal' })).toBe('')
    expect(toInteger(null, { onError: 'returnOriginal' })).toBeNull()
    expect(toInteger('abc', { onError: 'returnOriginal' })).toBe('abc')
  })

  it('should apply error handling when numeric conversion throws', () => {
    const symbol = Symbol('value')
    expect(toInteger(symbol)).toBe(0)
    expect(toInteger(symbol, { onError: 'returnOriginal' })).toBe(symbol)
    expect(() => toInteger(symbol, { onError: 'throwError' })).toThrow(
      TypeError,
    )
  })

  it('should handle min and max constraints', () => {
    expect(toInteger(5, { min: 10 })).toBe(10) // clamp
    expect(toInteger(20, { max: 15 })).toBe(15) // clamp
    expect(toInteger(10, { min: 5, max: 15 })).toBe(10) // within range
  })

  it('should handle outOfRange option', () => {
    expect(toInteger(5, { min: 10, outOfRange: 'clamp' })).toBe(10)
    expect(
      toInteger(5, { min: 10, outOfRange: 'useDefault', defaultValue: 99 }),
    ).toBe(99)
    expect(() => toInteger(5, { min: 10, outOfRange: 'throwError' })).toThrow(
      /out of range/u,
    )
  })

  it('should handle boolean values', () => {
    expect(toInteger(true)).toBe(1)
    expect(toInteger(false)).toBe(0)
  })

  it('should handle array values', () => {
    expect(toInteger([])).toBe(0)
    expect(toInteger([1, 2, 3])).toBe(0) // returns defaultValue for NaN
    expect(toInteger([1, 2, 3], { allowNaN: true })).toBeNaN()
    expect(toInteger([1, 2, 3], { defaultValue: 42 })).toBe(42)
  })

  it('should handle object values', () => {
    expect(toInteger({})).toBe(0) // returns defaultValue for NaN
    expect(toInteger({}, { allowNaN: true })).toBeNaN()
    expect(toInteger({}, { defaultValue: 42 })).toBe(42)
  })

  it('should handle decimal restriction', () => {
    expect(() =>
      toInteger(3.14, { allowDecimal: false, onError: 'throwError' }),
    ).toThrow(/decimal values are not allowed/iu)
    expect(
      toInteger(3.14, { allowDecimal: false, onError: 'returnOriginal' }),
    ).toBe(3.14)
  })

  it('should handle complex range scenarios', () => {
    // Test negative ranges
    expect(toInteger(-20, { min: -10, max: -5 })).toBe(-10)
    expect(toInteger(-3, { min: -10, max: -5 })).toBe(-5)
    expect(toInteger(-7, { min: -10, max: -5 })).toBe(-7)

    // Test with decimal inputs and ranges
    expect(toInteger(2.7, { min: 3, max: 10, allowDecimal: true })).toBe(3)
    expect(toInteger(12.3, { min: 3, max: 10, allowDecimal: true })).toBe(10)
    expect(toInteger(1, { min: 1.2 })).toBe(2)
    expect(toInteger(5, { max: 3.8 })).toBe(3)
    expect(() => toInteger(2, { min: 2.8, max: 2.2 })).toThrow(RangeError)
  })
})

describe(toNumber, () => {
  it('should return the number as-is when given a number', () => {
    expect(toNumber(42)).toBe(42)
    expect(toNumber(3.14)).toBe(3.14)
    expect(toNumber(-100)).toBe(-100)
    expect(toNumber(0)).toBe(0)
  })

  it('should convert a numeric string to a number', () => {
    expect(toNumber('42')).toBe(42)
    expect(toNumber('3.14')).toBe(3.14)
    expect(toNumber('-100')).toBe(-100)
    expect(toNumber('0')).toBe(0)
  })

  it('should parse only the leading numeric part of a string', () => {
    expect(toNumber('3.14abc')).toBe(3.14)
    expect(toNumber('10px')).toBe(10)
  })

  it('should throw TypeError when given NaN', () => {
    expect(() => toNumber(Number.NaN)).toThrow(TypeError)
    expect(() => toNumber(Number.NaN)).toThrow(
      'Expected a valid number, got NaN',
    )
  })

  it('should throw TypeError when given a non-numeric string', () => {
    expect(() => toNumber('abc')).toThrow(TypeError)
    expect(() => toNumber('abc')).toThrow('Expected a valid number, got NaN')
    expect(() => toNumber('')).toThrow(TypeError)
  })
})

describe(toFixed, () => {
  it('should format with default options (2 digits, omit trailing zeros)', () => {
    expect(toFixed(123.456)).toBe('123.46')
    expect(toFixed(123.4)).toBe('123.4')
    expect(toFixed(123)).toBe('123')
    expect(toFixed(1.005)).toBe('1')
  })

  it('should format with custom digits', () => {
    expect(toFixed(123.456, { digits: 1 })).toBe('123.5')
    expect(toFixed(123.456, { digits: 3 })).toBe('123.456')
    expect(toFixed(123.456, { digits: 0 })).toBe('123')
  })

  it('should keep trailing zeros when omitTrailingZeros is false', () => {
    expect(toFixed(123.4, { omitTrailingZeros: false })).toBe('123.40')
    expect(toFixed(123.4, { digits: 3, omitTrailingZeros: false })).toBe(
      '123.400',
    )
    expect(toFixed(123, { omitTrailingZeros: false })).toBe('123.00')
  })

  it('should handle negative numbers', () => {
    expect(toFixed(-123.456)).toBe('-123.46')
    expect(toFixed(-123.4)).toBe('-123.4')
    expect(toFixed(-123)).toBe('-123')
  })

  it('should handle zero', () => {
    expect(toFixed(0)).toBe('0')
    expect(toFixed(0, { omitTrailingZeros: false })).toBe('0.00')
  })

  it('should handle integer inputs', () => {
    expect(toFixed(42)).toBe('42')
    expect(toFixed(42, { omitTrailingZeros: false })).toBe('42.00')
  })
})

describe(round, () => {
  it('should round to nearest integer by default', () => {
    expect(round(1.2345)).toBe(1)
    expect(round(1.5)).toBe(2)
    expect(round(1.6)).toBe(2)
    expect(round(2.4)).toBe(2)
  })

  it('should round to specified decimal places', () => {
    expect(round(1.2345, 2)).toBe(1.23)
    expect(round(1.2345, 3)).toBe(1.235)
    expect(round(1.2345, 4)).toBe(1.2345)
  })

  it('should handle negative numbers correctly', () => {
    expect(round(-1.2345)).toBe(-1)
    expect(round(-1.5)).toBe(-1) // JavaScript Math.round uses banker's rounding
    expect(round(-1.2345, 2)).toBe(-1.23)
    expect(round(-1.6)).toBe(-2)
  })

  it('should handle zero decimal places explicitly', () => {
    expect(round(1.7, 0)).toBe(2)
    expect(round(1.2, 0)).toBe(1)
  })

  it('should handle large decimal places', () => {
    expect(round(3.141_592_65, 5)).toBe(3.141_59)
    expect(round(3.141_592_65, 8)).toBe(3.141_592_65)
  })

  it('should handle zero', () => {
    expect(round(0)).toBe(0)
    expect(round(0, 2)).toBe(0)
  })

  it('should handle very small numbers', () => {
    expect(round(0.000_01, 5)).toBe(0.000_01)
    expect(round(0.000_01, 4)).toBe(0)
  })

  it('should handle very large numbers', () => {
    expect(round(1_234_567.89, 1)).toBe(1_234_567.9)
    expect(round(1_234_567.89, 0)).toBe(1_234_568)
  })

  it('should maintain precision for common use cases', () => {
    expect(round(0.1 + 0.2, 1)).toBe(0.3)
    expect(round(0.1 + 0.2, 2)).toBe(0.3)
  })

  it('should handle negative decimal places', () => {
    // Rounding to tens, hundreds, etc
    expect(round(1234.56, -1)).toBe(1230)
    expect(round(1234.56, -2)).toBe(1200)
  })
})

describe(clamp, () => {
  it('should clamp within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('should handle default min/max', () => {
    expect(clamp(5)).toBe(5)
  })

  it('should handle min greater than max', () => {
    expect(clamp(5, 10, 0)).toBe(5)
    expect(clamp(-5, 10, 0)).toBe(0)
    expect(clamp(15, 10, 0)).toBe(10)
  })
})
