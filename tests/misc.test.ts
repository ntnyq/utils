import { describe, expect, it, vi } from 'vitest'
import {
  cAF,
  clamp,
  convertFromBytes,
  convertFromMilliseconds,
  convertStorageUnit,
  convertTimeUnit,
  convertToBytes,
  convertToMilliseconds,
  debounce,
  getRoot,
  rAF,
  STORAGE_UNITS,
  throttle,
  TIME_UNITS,
  waitFor,
  warnOnce,
} from '../src/misc'

describe('storage unit conversion', () => {
  describe('Constants STORAGE_UNITS', () => {
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
})

describe('time unit conversion', () => {
  describe('Constants TIME_UNITS', () => {
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
})

describe(warnOnce, () => {
  it('should warn only once per message', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warnOnce('msg')
    warnOnce('msg')
    warnOnce('another')
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })
})

describe(waitFor, () => {
  it('should resolve after specified ms', async () => {
    vi.useFakeTimers()
    const promise = waitFor(100)
    vi.advanceTimersByTime(100)
    await promise
    vi.useRealTimers()
  })
})

describe('throttle/debounce', () => {
  it('throttle should limit calls', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = throttle(50, spy)
    fn()
    fn()
    vi.advanceTimersByTime(60)
    fn()
    expect(spy).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('debounce should delay calls', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(50, spy)
    fn()
    fn()
    // Leading-edge debounce: first call invokes immediately
    expect(spy).toHaveBeenCalledOnce()
    vi.advanceTimersByTime(50)
    // No trailing call in current implementation
    expect(spy).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('cancel should prevent further execution', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const fn = debounce(50, spy)
    fn()
    fn.cancel()
    vi.advanceTimersByTime(60)
    // First call already executed; cancel prevents further calls
    expect(spy).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})

describe('raf helpers', () => {
  it('should use window in browser-like env', () => {
    const win: any = {
      requestAnimationFrame: vi.fn(cb => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        cb(0 as any)
        return 1
      }),
      cancelAnimationFrame: vi.fn(),
    }
    const doc: any = {}
    vi.stubGlobal('window', win)
    vi.stubGlobal('document', doc)
    vi.stubGlobal('self', win)

    expect(getRoot()).toBe(win)
    const id = rAF(() => {})
    expect(id).toBe(1)
    cAF(id)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(win.cancelAnimationFrame).toHaveBeenCalledWith(1)
  })
})
