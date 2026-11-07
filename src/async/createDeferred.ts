/**
 * A promise with externally accessible resolve and reject functions.
 */
export interface Deferred<Value = unknown> {
  /**
   * Promise consumed by callers waiting for the result.
   */
  promise: Promise<Value>

  /**
   * Resolves with a value or adopts a promise-like result.
   */
  resolve: (value: Value | PromiseLike<Value>) => void

  /**
   * Rejects with the supplied reason.
   */
  reject: (reason: unknown) => void
}

/**
 * Creates a promise that can be resolved or rejected externally.
 *
 * Uses the Promise constructor for compatibility with environments without
 * Promise.withResolvers. The first resolve or reject call locks the result,
 * including when resolve adopts a pending promise-like value.
 *
 * @returns A promise and its resolve and reject functions.
 *
 * @example
 *
 * ```typescript
 * import { createDeferred } from '@ntnyq/utils'
 *
 * const { promise, resolve } = createDeferred<string>()
 * setTimeout(() => resolve('ready'), 100)
 * console.log(await promise) // => 'ready'
 * ```
 */
export function createDeferred<Value = unknown>(): Deferred<Value> {
  // The Promise executor runs synchronously before these functions are returned.
  let resolve!: Deferred<Value>['resolve']
  let reject!: Deferred<Value>['reject']

  const promise = new Promise<Value>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    promise,
    resolve,
    reject,
  }
}
