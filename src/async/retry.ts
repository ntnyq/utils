import type { Awaitable } from '../types'

export interface RetryContext {
  /**
   * Current attempt number, starting at 1.
   */
  attempt: number

  /**
   * Maximum number of attempts.
   */
  maxAttempts: number

  /**
   * Signal provided to {@link retry}.
   */
  signal: AbortSignal | undefined
}

export type RetryBackoff = (error: unknown, context: RetryContext) => number

export type RetryOperation<Value> = (context: RetryContext) => Awaitable<Value>

export type RetryPredicate = (
  error: unknown,
  context: RetryContext,
) => Awaitable<boolean>

export interface RetryOptions {
  /**
   * Delay between attempts. A callback can implement linear, exponential, or
   * error-specific backoff.
   *
   * @default 0
   */
  backoff?: number | RetryBackoff

  /**
   * Maximum number of attempts, including the initial call.
   *
   * @default 3
   */
  maxAttempts?: number

  /**
   * Decides whether a failed operation should be attempted again.
   *
   * @default () => true
   */
  shouldRetry?: RetryPredicate

  /**
   * Stops the active attempt, retry predicate, or backoff delay promptly.
   */
  signal?: AbortSignal
}

function assertValidDelay(delay: number): void {
  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError('Retry backoff must be a non-negative finite number')
  }
}

function assertValidMaxAttempts(maxAttempts: number): void {
  if (!Number.isInteger(maxAttempts) || maxAttempts <= 0) {
    throw new RangeError('Retry maxAttempts must be a positive integer')
  }
}

async function runWithAbort<Value>(
  operation: () => Awaitable<Value>,
  signal: AbortSignal | undefined,
): Promise<Value> {
  signal?.throwIfAborted()

  if (!signal) {
    return await operation()
  }

  let handleAbort: (() => void) | undefined
  // oxlint-disable-next-line promise/avoid-new
  const aborted = new Promise<never>((_resolve, reject) => {
    handleAbort = () => reject(signal.reason)
    signal.addEventListener('abort', handleAbort, { once: true })

    if (signal.aborted) {
      handleAbort()
    }
  })

  try {
    return await Promise.race([Promise.resolve().then(operation), aborted])
  } finally {
    if (handleAbort) {
      signal.removeEventListener('abort', handleAbort)
    }
  }
}

async function waitForBackoff(
  delay: number,
  signal: AbortSignal | undefined,
): Promise<void> {
  signal?.throwIfAborted()

  if (delay === 0) {
    return
  }

  // oxlint-disable-next-line promise/avoid-new
  await new Promise<void>((resolve, reject) => {
    const timeout = {
      id: undefined as ReturnType<typeof setTimeout> | undefined,
    }

    function handleAbort() {
      if (timeout.id !== undefined) {
        clearTimeout(timeout.id)
      }
      signal?.removeEventListener('abort', handleAbort)
      reject(signal?.reason)
    }
    timeout.id = setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, delay)

    signal?.addEventListener('abort', handleAbort, { once: true })
    if (signal?.aborted) {
      handleAbort()
    }
  })
}

/**
 * Retries a synchronous or asynchronous operation.
 *
 * The operation receives a 1-based attempt number and the configured signal.
 * A backoff callback can derive the next delay from the failure and attempt
 * context.
 *
 * @param operation - Operation to execute.
 * @param options - Attempt, backoff, filtering, and cancellation options.
 * @returns The first successful operation result.
 *
 * @example
 *
 * ```typescript
 * import { retry } from '@ntnyq/utils'
 *
 * const result = await retry(
 *   ({ signal }) => fetch('/api/data', { signal }),
 *   {
 *     backoff: (_error, { attempt }) => 100 * 2 ** (attempt - 1),
 *     maxAttempts: 3,
 *     shouldRetry: error => error instanceof TypeError,
 *   },
 * )
 * ```
 */
export async function retry<Value>(
  operation: RetryOperation<Value>,
  options: RetryOptions = {},
): Promise<Value> {
  const {
    backoff = 0,
    maxAttempts = 3,
    shouldRetry = () => true,
    signal,
  } = options

  assertValidMaxAttempts(maxAttempts)
  if (typeof backoff === 'number') {
    assertValidDelay(backoff)
  }
  signal?.throwIfAborted()

  for (let attempt = 1; ; attempt++) {
    const context: RetryContext = {
      attempt,
      maxAttempts,
      signal,
    }

    try {
      // Retry attempts are intentionally sequential.
      // oxlint-disable-next-line no-await-in-loop
      return await runWithAbort(() => operation(context), signal)
    } catch (error) {
      if (signal?.aborted) {
        throw signal.reason
      }

      if (attempt >= maxAttempts) {
        throw error
      }

      // A retry decision must complete before the next attempt is scheduled.
      // oxlint-disable-next-line no-await-in-loop
      const canRetry = await runWithAbort(
        () => shouldRetry(error, context),
        signal,
      )
      if (!canRetry) {
        throw error
      }

      const delay =
        typeof backoff === 'function' ? backoff(error, context) : backoff
      assertValidDelay(delay)
      // Backoff is part of the sequential retry lifecycle.
      // oxlint-disable-next-line no-await-in-loop
      await waitForBackoff(delay, signal)
    }
  }
}
