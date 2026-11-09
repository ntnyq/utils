import { createDeferred } from './createDeferred'

/**
 * Waits for a task until it settles or the signal aborts.
 *
 * @param task - A promise or promise-like value to observe.
 * @param signal - Aborting rejects the returned promise with the signal's reason.
 * @returns The task result if it wins the race. The task can continue after an
 * abort, and any subsequent rejection is still observed.
 *
 * @example
 * ```typescript
 * const controller = new AbortController()
 * const task = Promise.resolve('ready')
 * const value = await raceWithSignal(task, controller.signal) // 'ready'
 * ```
 */
export async function raceWithSignal<Value>(
  task: PromiseLike<Value>,
  signal: AbortSignal,
): Promise<Awaited<Value>> {
  const aborted = createDeferred<never>()
  const handleAbort = () => aborted.reject(signal.reason)
  if (signal.aborted) {
    handleAbort()
  } else {
    signal.addEventListener('abort', handleAbort, { once: true })
  }

  try {
    // A pre-aborted signal wins even when the task has already settled.
    return await Promise.race([aborted.promise, task])
  } finally {
    signal.removeEventListener('abort', handleAbort)
  }
}
