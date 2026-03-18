import { describe, expect, it } from 'vitest'
import { randomNumber, toInteger } from '../src/number'

describe(randomNumber, () => {
  it('should return a number within the specified range', () => {
    const min = 1
    const max = 10
    const result = randomNumber(min, max)

    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThan(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should handle single argument (max only)', () => {
    const max = 5
    const result = randomNumber(max)

    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should swap min and max when min > max', () => {
    const min = 10
    const max = 1
    const result = randomNumber(min, max)

    expect(result).toBeGreaterThanOrEqual(max)
    expect(result).toBeLessThan(min)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should include max value when includeMax is true', () => {
    const min = 1
    const max = 2
    const results = new Set()

    // Generate many results to test probability
    for (let i = 0; i < 1000; i++) {
      const result = randomNumber(min, max, { includeMax: true })
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
    const min = 1
    const max = 2
    const results = new Set()

    // Generate many results to test probability
    for (let i = 0; i < 1000; i++) {
      const result = randomNumber(min, max, { includeMax: false })
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
    const result = randomNumber(value, value)

    expect(result).toBe(value)
  })

  it('should handle equal min and max values with includeMax', () => {
    const value = 5
    const result = randomNumber(value, value, { includeMax: true })

    expect(result).toBe(value)
  })

  it('should handle negative numbers', () => {
    const min = -10
    const max = -1
    const result = randomNumber(min, max)

    expect(result).toBeGreaterThanOrEqual(min)
    expect(result).toBeLessThanOrEqual(max)
    expect(Number.isInteger(result)).toBeTruthy()
  })

  it('should handle zero as min or max', () => {
    const result1 = randomNumber(0, 5)
    expect(result1).toBeGreaterThanOrEqual(0)
    expect(result1).toBeLessThanOrEqual(5)

    const result2 = randomNumber(-5, 0)
    expect(result2).toBeGreaterThanOrEqual(-5)
    expect(result2).toBeLessThanOrEqual(0)
  })

  it('should return consistent type (integer)', () => {
    const min = 1.5
    const max = 5.7
    const result = randomNumber(min, max)

    expect(Number.isInteger(result)).toBeTruthy()
    expect(result).toBeGreaterThanOrEqual(Math.floor(min))
    expect(result).toBeLessThanOrEqual(Math.floor(max))
  })

  it('should work with decimal inputs and truncate to integer', () => {
    const min = 1.9
    const max = 3.1
    const result = randomNumber(min, max)

    expect(Number.isInteger(result)).toBeTruthy()
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(3)
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
    expect(toInteger(null)).toBe(null) // 'useDefault' returns original value
    expect(toInteger(undefined)).toBe(undefined)
    expect(toInteger(null, { onError: 'useDefault', defaultValue: 42 })).toBe(
      null,
    )
    expect(
      toInteger(undefined, { onError: 'useDefault', defaultValue: 42 }),
    ).toBe(undefined)
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
    expect(() => toInteger('', { onError: 'throwError' })).toThrow()
    expect(() => toInteger(null, { onError: 'throwError' })).toThrow()
    expect(() => toInteger('abc', { onError: 'throwError' })).toThrow()

    expect(toInteger('', { onError: 'returnOriginal' })).toBe('')
    expect(toInteger(null, { onError: 'returnOriginal' })).toBe(0) // returns defaultValue when onError is 'returnOriginal'
    expect(toInteger('abc', { onError: 'returnOriginal' })).toBe('abc')
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
    expect(() => toInteger(5, { min: 10, outOfRange: 'throwError' })).toThrow()
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
    ).toThrow()
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
  })
})
