import { describe, expect, it } from 'vitest'
import {
  convertFromBytes,
  convertFromMilliseconds,
  convertStorageUnit,
  convertTimeUnit,
  convertToBytes,
  convertToMilliseconds,
  STORAGE_UNITS,
  TIME_UNITS,
} from '../src/misc'

describe('storage unit conversion', () => {
  describe('STORAGE_UNITS', () => {
    it('should have correct values', () => {
      expect(STORAGE_UNITS).toMatchInlineSnapshot(`
        {
          "BYTE": 1,
          "GB": 1073741824,
          "KB": 1024,
          "MB": 1048576,
          "TB": 1099511627776,
        }
      `)
    })
  })

  describe('convertToBytes', () => {
    it('should convert MB to bytes by default', () => {
      expect(convertToBytes(1)).toBe(1048576)
      expect(convertToBytes(5)).toBe(5242880)
    })

    it('should convert different units to bytes', () => {
      expect(convertToBytes(1, 'BYTE')).toBe(1)
      expect(convertToBytes(1, 'KB')).toBe(1024)
      expect(convertToBytes(1, 'MB')).toBe(1048576)
      expect(convertToBytes(1, 'GB')).toBe(1073741824)
      expect(convertToBytes(1, 'TB')).toBe(1099511627776)
    })
  })

  describe('convertFromBytes', () => {
    it('should convert bytes to MB by default', () => {
      expect(convertFromBytes(1048576)).toBe(1)
      expect(convertFromBytes(5242880)).toBe(5)
    })

    it('should convert bytes to different units', () => {
      expect(convertFromBytes(1024, 'BYTE')).toBe(1024)
      expect(convertFromBytes(1024, 'KB')).toBe(1)
      expect(convertFromBytes(1048576, 'MB')).toBe(1)
      expect(convertFromBytes(1073741824, 'GB')).toBe(1)
      expect(convertFromBytes(1099511627776, 'TB')).toBe(1)
    })
  })

  describe('convertStorageUnit', () => {
    it('should convert between units', () => {
      expect(convertStorageUnit(1, 'GB', 'MB')).toBe(1024)
      expect(convertStorageUnit(2048, 'MB', 'GB')).toBe(2)
      expect(convertStorageUnit(1024, 'KB', 'MB')).toBe(1)
      expect(convertStorageUnit(1, 'TB', 'GB')).toBe(1024)
    })

    it('should handle same unit conversion', () => {
      expect(convertStorageUnit(100, 'MB', 'MB')).toBe(100)
      expect(convertStorageUnit(50, 'KB', 'KB')).toBe(50)
    })
  })
})

describe('time unit conversion', () => {
  describe('TIME_UNITS', () => {
    it('should have correct values', () => {
      expect(TIME_UNITS).toMatchInlineSnapshot(`
        {
          "DAY": 86400000,
          "HOUR": 3600000,
          "MILLISECOND": 1,
          "MINUTE": 60000,
          "SECOND": 1000,
          "WEEK": 604800000,
        }
      `)
    })
  })

  describe('convertToMilliseconds', () => {
    it('should convert seconds to milliseconds by default', () => {
      expect(convertToMilliseconds(1)).toBe(1000)
      expect(convertToMilliseconds(5)).toBe(5000)
    })

    it('should convert different units to milliseconds', () => {
      expect(convertToMilliseconds(1, 'MILLISECOND')).toBe(1)
      expect(convertToMilliseconds(1, 'SECOND')).toBe(1000)
      expect(convertToMilliseconds(1, 'MINUTE')).toBe(60000)
      expect(convertToMilliseconds(1, 'HOUR')).toBe(3600000)
      expect(convertToMilliseconds(1, 'DAY')).toBe(86400000)
      expect(convertToMilliseconds(1, 'WEEK')).toBe(604800000)
    })
  })

  describe('convertFromMilliseconds', () => {
    it('should convert milliseconds to seconds by default', () => {
      expect(convertFromMilliseconds(1000)).toBe(1)
      expect(convertFromMilliseconds(5000)).toBe(5)
    })

    it('should convert milliseconds to different units', () => {
      expect(convertFromMilliseconds(1000, 'MILLISECOND')).toBe(1000)
      expect(convertFromMilliseconds(1000, 'SECOND')).toBe(1)
      expect(convertFromMilliseconds(60000, 'MINUTE')).toBe(1)
      expect(convertFromMilliseconds(3600000, 'HOUR')).toBe(1)
      expect(convertFromMilliseconds(86400000, 'DAY')).toBe(1)
      expect(convertFromMilliseconds(604800000, 'WEEK')).toBe(1)
    })
  })

  describe('convertTimeUnit', () => {
    it('should convert between units', () => {
      expect(convertTimeUnit(1, 'HOUR', 'MINUTE')).toBe(60)
      expect(convertTimeUnit(120, 'SECOND', 'MINUTE')).toBe(2)
      expect(convertTimeUnit(2, 'WEEK', 'DAY')).toBe(14)
      expect(convertTimeUnit(1, 'DAY', 'HOUR')).toBe(24)
    })

    it('should handle same unit conversion', () => {
      expect(convertTimeUnit(100, 'SECOND', 'SECOND')).toBe(100)
      expect(convertTimeUnit(50, 'MINUTE', 'MINUTE')).toBe(50)
    })
  })
})
