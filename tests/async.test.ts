import { afterEach, describe, expect, it, vi } from 'vitest'
import { mapAsync, retry, waitFor } from '../src/async'

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

  it('should snapshot source items before mapping', async () => {
    const source = [1, 2]
    const result = mapAsync(
      source,
      async (value, index) => {
        if (index === 0) {
          source[1] = 99
          await waitFor(0)
        }
        return value
      },
      { concurrency: 1 },
    )

    await expect(result).resolves.toStrictEqual([1, 2])
    expect(source).toStrictEqual([1, 99])
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

describe(retry, () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return the first successful result', async () => {
    const attempts: number[] = []

    const result = await retry(
      ({ attempt }) => {
        attempts.push(attempt)
        if (attempt < 3) {
          throw new Error(`attempt ${attempt} failed`)
        }
        return 'done'
      },
      { maxAttempts: 3 },
    )

    expect(result).toBe('done')
    expect(attempts).toStrictEqual([1, 2, 3])
  })

  it('should reject with the final operation error', async () => {
    const errors = [new Error('first'), new Error('second')]
    let index = 0

    await expect(
      retry(
        () => {
          throw errors[index++]
        },
        { maxAttempts: 2 },
      ),
    ).rejects.toBe(errors[1])
  })

  it('should apply callback-based backoff between attempts', async () => {
    vi.useFakeTimers()
    const operation = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('first'))
      .mockRejectedValueOnce(new Error('second'))
      .mockResolvedValue('done')
    const backoff = vi.fn(
      (_error: unknown, { attempt }: { attempt: number }) => attempt * 100,
    )
    const result = retry(operation, {
      backoff,
      maxAttempts: 3,
    })

    await vi.advanceTimersByTimeAsync(0)
    expect(operation).toHaveBeenCalledOnce()

    await vi.advanceTimersByTimeAsync(99)
    expect(operation).toHaveBeenCalledOnce()
    await vi.advanceTimersByTimeAsync(1)
    expect(operation).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(199)
    expect(operation).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1)

    await expect(result).resolves.toBe('done')
    expect(backoff).toHaveBeenCalledTimes(2)
  })

  it('should stop when shouldRetry returns false', async () => {
    const error = new Error('not retryable')
    const operation = vi.fn(() => {
      throw error
    })
    const shouldRetry = vi.fn(async () => false)

    await expect(
      retry(operation, {
        maxAttempts: 3,
        shouldRetry,
      }),
    ).rejects.toBe(error)
    expect(operation).toHaveBeenCalledOnce()
    expect(shouldRetry).toHaveBeenCalledOnce()
  })

  it('should reject immediately when the signal is already aborted', async () => {
    const controller = new AbortController()
    const reason = new Error('stopped')
    const operation = vi.fn(() => true)
    controller.abort(reason)

    await expect(retry(operation, { signal: controller.signal })).rejects.toBe(
      reason,
    )
    expect(operation).not.toHaveBeenCalled()
  })

  it('should reject promptly when an active attempt is aborted', async () => {
    const controller = new AbortController()
    const reason = new Error('cancelled')
    let receivedSignal: AbortSignal | undefined
    const result = retry(
      ({ signal }) => {
        receivedSignal = signal
        // oxlint-disable-next-line promise/avoid-new
        return new Promise<never>(() => {})
      },
      { signal: controller.signal },
    )

    await Promise.resolve()
    controller.abort(reason)

    await expect(result).rejects.toBe(reason)
    expect(receivedSignal).toBe(controller.signal)
  })

  it('should cancel a pending backoff delay', async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const reason = new Error('cancelled')
    const operation = vi.fn(() => {
      throw new Error('failed')
    })
    const result = retry(operation, {
      backoff: 1_000,
      maxAttempts: 3,
      signal: controller.signal,
    })

    await vi.advanceTimersByTimeAsync(0)
    controller.abort(reason)

    await expect(result).rejects.toBe(reason)
    expect(operation).toHaveBeenCalledOnce()
  })

  it('should reject invalid attempt and backoff values', async () => {
    await expect(retry(() => true, { maxAttempts: 0 })).rejects.toThrow(
      RangeError,
    )
    await expect(
      retry(() => true, { backoff: Number.POSITIVE_INFINITY }),
    ).rejects.toThrow(RangeError)
    await expect(
      retry(
        () => {
          throw new Error('failed')
        },
        { backoff: () => -1 },
      ),
    ).rejects.toThrow(RangeError)
  })
})
