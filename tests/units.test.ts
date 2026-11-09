import { describe, expect, it } from 'vitest'
import { formatByteSize, formatDurationClock } from '../src'
import type { FormatByteSizeOptions, FormatDurationClockOptions } from '../src'
import {
  convertFromBytes,
  convertFromMilliseconds,
  convertStorageUnit,
  convertTimeUnit,
  convertToBytes,
  convertToMilliseconds,
  STORAGE_UNITS,
  TIME_UNITS,
} from '../src/units'

describe('storage unit conversion', () => {
  describe('constants STORAGE_UNITS', () => {
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

  describe(convertToBytes, () => {
    it('should convert MB to bytes by default', () => {
      expect(convertToBytes(1)).toBe(1_048_576)
      expect(convertToBytes(5)).toBe(5_242_880)
    })

    it('should convert different units to bytes', () => {
      expect(convertToBytes(1, 'BYTE')).toBe(1)
      expect(convertToBytes(1, 'KB')).toBe(1024)
      expect(convertToBytes(1, 'MB')).toBe(1_048_576)
      expect(convertToBytes(1, 'GB')).toBe(1_073_741_824)
      expect(convertToBytes(1, 'TB')).toBe(1_099_511_627_776)
    })
  })

  describe(convertFromBytes, () => {
    it('should convert bytes to MB by default', () => {
      expect(convertFromBytes(1_048_576)).toBe(1)
      expect(convertFromBytes(5_242_880)).toBe(5)
    })

    it('should convert bytes to different units', () => {
      expect(convertFromBytes(1024, 'BYTE')).toBe(1024)
      expect(convertFromBytes(1024, 'KB')).toBe(1)
      expect(convertFromBytes(1_048_576, 'MB')).toBe(1)
      expect(convertFromBytes(1_073_741_824, 'GB')).toBe(1)
      expect(convertFromBytes(1_099_511_627_776, 'TB')).toBe(1)
    })
  })

  describe(convertStorageUnit, () => {
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

  describe(formatByteSize, () => {
    it.each([
      [0, '0 B'],
      [-0, '0 B'],
      [0.5, '0.5 B'],
      [1023, '1023 B'],
      [1024, '1 KB'],
      [1536, '1.5 KB'],
      [1_048_575, '1024 KB'],
      [1_048_576, '1 MB'],
      [2 ** 30, '1 GB'],
      [2 ** 40, '1 TB'],
      [2 ** 50, '1 PB'],
      [2 ** 60, '1 EB'],
      [2 ** 70, '1024 EB'],
    ] as const)('should format %s bytes as %s', (bytes, expected) => {
      expect(formatByteSize(bytes)).toBe(expected)
    })

    it('should support compact and fixed-precision IEC labels', () => {
      const options: FormatByteSizeOptions = {
        digits: 1,
        omitTrailingZeros: false,
        unitStyle: 'iec',
      }
      expect(formatByteSize(1024, { separator: '' })).toBe('1KB')
      expect(formatByteSize(1024, options)).toBe('1.0 KiB')
      expect(formatByteSize(2 ** 20, options)).toBe('1.0 MiB')
      expect(formatByteSize(0, options)).toBe('0.0 B')
      expect(formatByteSize(1536, { digits: 0 })).toBe('2 KB')
      expect(formatByteSize(1728, { digits: 3 })).toBe('1.688 KB')
    })

    it('should accept the maximum fixed precision', () => {
      expect(
        formatByteSize(1024, { digits: 100, omitTrailingZeros: false }),
      ).toBe(`1.${'0'.repeat(100)} KB`)
    })

    it.each([-1, Number.NaN, Infinity, -Infinity])(
      'should reject invalid byte counts (%s)',
      bytes => {
        expect(() => formatByteSize(bytes)).toThrow(RangeError)
      },
    )

    it.each([-1, 0.5, 101, Number.NaN, Infinity])(
      'should reject invalid precision (%s)',
      digits => {
        expect(() => formatByteSize(1024, { digits })).toThrow(RangeError)
      },
    )
  })
})

describe('time unit conversion', () => {
  describe('constants TIME_UNITS', () => {
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

  describe(convertToMilliseconds, () => {
    it('should convert seconds to milliseconds by default', () => {
      expect(convertToMilliseconds(1)).toBe(1000)
      expect(convertToMilliseconds(5)).toBe(5000)
    })

    it('should convert different units to milliseconds', () => {
      expect(convertToMilliseconds(1, 'MILLISECOND')).toBe(1)
      expect(convertToMilliseconds(1, 'SECOND')).toBe(1000)
      expect(convertToMilliseconds(1, 'MINUTE')).toBe(60_000)
      expect(convertToMilliseconds(1, 'HOUR')).toBe(3_600_000)
      expect(convertToMilliseconds(1, 'DAY')).toBe(86_400_000)
      expect(convertToMilliseconds(1, 'WEEK')).toBe(604_800_000)
    })
  })

  describe(convertFromMilliseconds, () => {
    it('should convert milliseconds to seconds by default', () => {
      expect(convertFromMilliseconds(1000)).toBe(1)
      expect(convertFromMilliseconds(5000)).toBe(5)
    })

    it('should convert milliseconds to different units', () => {
      expect(convertFromMilliseconds(1000, 'MILLISECOND')).toBe(1000)
      expect(convertFromMilliseconds(1000, 'SECOND')).toBe(1)
      expect(convertFromMilliseconds(60_000, 'MINUTE')).toBe(1)
      expect(convertFromMilliseconds(3_600_000, 'HOUR')).toBe(1)
      expect(convertFromMilliseconds(86_400_000, 'DAY')).toBe(1)
      expect(convertFromMilliseconds(604_800_000, 'WEEK')).toBe(1)
    })
  })

  describe(convertTimeUnit, () => {
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

  describe(formatDurationClock, () => {
    it.each([
      [0, '00:00:00', '00:00'],
      [1, '00:00:01', '00:01'],
      [59.99, '00:00:59', '00:59'],
      [60, '00:01:00', '01:00'],
      [3_661.9, '01:01:01', '61:01'],
      [90_061, '25:01:01', '1501:01'],
      [360_002, '100:00:02', '6000:02'],
    ] as const)(
      'should format %s elapsed seconds',
      (seconds, clock, minutes) => {
        const options: FormatDurationClockOptions = { mode: 'totalMinutes' }
        expect(formatDurationClock(seconds)).toBe(clock)
        expect(formatDurationClock(seconds, options)).toBe(minutes)
      },
    )

    it.each([-1, Number.NaN, Infinity, -Infinity])(
      'should use zero for %s seconds',
      seconds => {
        expect(formatDurationClock(seconds, { mode: 'hours' })).toBe('00:00:00')
        expect(formatDurationClock(seconds, { mode: 'totalMinutes' })).toBe(
          '00:00',
        )
      },
    )
  })
})
