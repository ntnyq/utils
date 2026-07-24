import type { Awaitable } from '../types'

export interface MapAsyncOptions {
  /**
   * Maximum number of mapper calls running at once.
   *
   * @default Infinity
   */
  concurrency?: number

  /**
   * Stops scheduling new work and rejects promptly when aborted.
   *
   * The same signal is passed to every mapper call so active work can
   * cooperate with cancellation.
   */
  signal?: AbortSignal
}

export type MapAsyncMapper<T, Result> = (
  item: T,
  index: number,
  signal: AbortSignal | undefined,
) => Awaitable<Result>

function validateConcurrency(concurrency: number): void {
  if (
    concurrency !== Number.POSITIVE_INFINITY &&
    (!Number.isInteger(concurrency) || concurrency <= 0)
  ) {
    throw new RangeError('Concurrency must be a positive integer or Infinity')
  }
}

/**
 * Maps array items asynchronously with an optional concurrency limit.
 *
 * Results preserve input order even when mapper calls complete out of order.
 * When aborted or rejected, no new mapper calls are started; already-running
 * calls can observe the provided signal and stop cooperatively.
 *
 * @param items - Source items.
 * @param mapper - Async or sync mapper.
 * @param options - Concurrency and cancellation options.
 * @returns Mapped results in source order.
 *
 * @example
 *
 * ```typescript
 * import { mapAsync } from '@ntnyq/utils'
 *
 * const result = await mapAsync(
 *   [1, 2, 3],
 *   async value => value * 2,
 *   { concurrency: 2 },
 * )
 * console.log(result) // => [2, 4, 6]
 * ```
 */
export async function mapAsync<T, Result>(
  items: readonly T[],
  mapper: MapAsyncMapper<T, Result>,
  options: MapAsyncOptions = {},
): Promise<Result[]> {
  const { concurrency = Number.POSITIVE_INFINITY, signal } = options
  validateConcurrency(concurrency)
  signal?.throwIfAborted()

  if (items.length === 0) {
    return []
  }

  const sourceItems = [...items]
  const results: Result[] = []
  const workerCount = Math.min(concurrency, sourceItems.length)
  let isStopped = false
  let nextIndex = 0

  const runWorker = async () => {
    while (true) {
      if (isStopped) {
        return
      }

      signal?.throwIfAborted()
      const index = nextIndex
      nextIndex++
      if (index >= sourceItems.length) {
        return
      }

      try {
        // Each worker is intentionally sequential; worker count is the limit.
        // oxlint-disable-next-line no-await-in-loop
        results[index] = await mapper(sourceItems[index]!, index, signal)
      } catch (error) {
        isStopped = true
        throw error
      }
    }
  }

  const workers = Promise.all(
    Array.from({ length: workerCount }, () => runWorker()),
  )
  if (!signal) {
    await workers
    return results
  }

  let handleAbort: (() => void) | undefined
  // oxlint-disable-next-line promise/avoid-new
  const aborted = new Promise<never>((_resolve, reject) => {
    handleAbort = () => {
      isStopped = true
      reject(signal.reason)
    }
    signal.addEventListener('abort', handleAbort, { once: true })
    if (signal.aborted) {
      handleAbort()
    }
  })

  try {
    await Promise.race([workers, aborted])
    return results
  } finally {
    if (handleAbort) {
      signal.removeEventListener('abort', handleAbort)
    }
  }
}
