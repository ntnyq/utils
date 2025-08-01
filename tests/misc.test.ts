import { describe, expect, it } from 'vitest'
import {
  convertFromBytes,
  convertStorageUnit,
  convertToBytes,
  STORAGE_UNITS,
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
