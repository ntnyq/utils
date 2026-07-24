import { describe, expect, it, vi } from 'vitest'
import { mapAsync, waitFor } from '../src/async'

describe(waitFor, () => {
  it('should resolve after specified ms', async () => {
    vi.useFakeTimers()
    const promise = waitFor(100)
    vi.advanceTimersByTime(100)
    await promise
    vi.useRealTimers()
  })
})

describe(mapAsync, () => {
  it('should preserve result order and enforce the concurrency limit', async () => {
    let activeCount = 0
    let maximumActiveCount = 0

    const result = await mapAsync(
      [30, 5, 15],
      async delay => {
        activeCount++
        maximumActiveCount = Math.max(maximumActiveCount, activeCount)
        await waitFor(delay)
        activeCount--
        return delay / 5
      },
      { concurrency: 2 },
    )

    expect(result).toStrictEqual([6, 1, 3])
    expect(maximumActiveCount).toBe(2)
  })

  it('should support synchronous mappers', async () => {
    await expect(
      mapAsync([1, 2, 3], value => value * 2),
    ).resolves.toStrictEqual([2, 4, 6])
  })

  it('should reject invalid concurrency values', async () => {
    await expect(
      mapAsync([1], value => value, { concurrency: 0 }),
    ).rejects.toThrow(RangeError)
    await expect(
      mapAsync([1], value => value, { concurrency: 1.5 }),
    ).rejects.toThrow(RangeError)
  })

  it('should stop scheduling new work after a mapper rejects', async () => {
    const visited: number[] = []
    const result = mapAsync(
      [1, 2, 3],
      value => {
        visited.push(value)
        if (value === 2) {
          throw new Error('failed')
        }
        return value
      },
      { concurrency: 1 },
    )

    await expect(result).rejects.toThrow('failed')
    expect(visited).toStrictEqual([1, 2])
  })

  it('should reject immediately when the signal is already aborted', async () => {
    const controller = new AbortController()
    const reason = new Error('stopped')
    const mapper = vi.fn((value: number) => value)
    controller.abort(reason)

    await expect(
      mapAsync([1], mapper, { signal: controller.signal }),
    ).rejects.toBe(reason)
    expect(mapper).not.toHaveBeenCalled()
  })

  it('should reject promptly and pass the signal to active work', async () => {
    const controller = new AbortController()
    const reason = new Error('cancelled')
    const receivedSignals: (AbortSignal | undefined)[] = []
    const result = mapAsync(
      [1, 2],
      async (_value, _index, signal) => {
        receivedSignals.push(signal)
        await waitFor(0)
        signal?.throwIfAborted()
        return true
      },
      { concurrency: 1, signal: controller.signal },
    )

    controller.abort(reason)

    await expect(result).rejects.toBe(reason)
    expect(receivedSignals).toStrictEqual([controller.signal])
  })
})
