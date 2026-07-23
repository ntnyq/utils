export interface ThrottleDebounceOptions {
  /**
   * Use debounce behavior when calling {@link throttle}.
   *
   * @default false
   */
  isDebounce?: boolean
}

function assertValidDelay(delay: number): void {
  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError('Delay must be a non-negative finite number')
  }
}

/**
 * Throttle a function to limit its execution to a maximum of once per a specified time interval.
 *
 * @param delay - Zero or greater delay in milliseconds
 * @param callback - A function to be throttled
 * @param options - throttle options
 * @returns A throttled function
 * @example
 *
 * ```typescript
 * import { throttle } from '@ntnyq/utils'
 *
 * const onResize = throttle(200, () => console.log('resized'))
 * onResize()
 * ```
 *
 */
export function throttle<
  // oxlint-disable-next-line typescript/no-invalid-void-type
  T extends ((...args: any[]) => undefined | void) | undefined | null,
>(
  delay: number,
  callback: Exclude<T, undefined | null>,
  options: ThrottleDebounceOptions = {},
): T & { cancel: () => void } {
  const { isDebounce } = options

  if (isDebounce) {
    return debounce(delay, callback)
  }

  assertValidDelay(delay)

  let lastExec = Number.NEGATIVE_INFINITY
  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined
  let pendingArgs: Parameters<Exclude<T, null | undefined>> | undefined =
    undefined
  let pendingReceiver: unknown

  function clearExistingTimeout() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  function cancel() {
    clearExistingTimeout()
    pendingArgs = undefined
    pendingReceiver = undefined
  }

  function setPendingCall(
    receiver: unknown,
    args: Parameters<Exclude<T, null | undefined>>,
  ) {
    pendingArgs = args
    pendingReceiver = receiver
  }

  function exec(timestamp = Date.now()) {
    const args = pendingArgs
    if (!args) {
      return
    }

    const receiver = pendingReceiver
    pendingArgs = undefined
    pendingReceiver = undefined
    timeoutId = undefined
    lastExec = timestamp
    callback.apply(receiver, args)
  }

  function wrapper(
    this: unknown,
    ...args: Parameters<Exclude<T, null | undefined>>
  ) {
    const now = Date.now()
    const remaining = delay - (now - lastExec)
    setPendingCall(this, args)

    if (remaining <= 0) {
      clearExistingTimeout()
      exec(now)
      return
    }

    if (timeoutId === undefined) {
      timeoutId = setTimeout(exec, remaining)
    }
  }

  wrapper.cancel = cancel

  return wrapper as T & { cancel: () => void }
}

/**
 * Creates a trailing-edge debounced version of a function. The latest call is
 * invoked after no new calls have arrived for the configured delay.
 * @param delay - The debounce delay in milliseconds.
 * @param callback - The function to debounce.
 * @param options - Compatibility options.
 * @returns A debounced function with a cancel method.
 *
 * @example
 *
 * ```typescript
 * import { debounce } from '@ntnyq/utils'
 *
 * const onSearch = debounce(300, () => console.log('search'))
 * onSearch()
 * ```
 */
export function debounce<
  // oxlint-disable-next-line typescript/no-invalid-void-type
  T extends ((...args: any[]) => undefined | void) | undefined | null,
>(
  delay: number,
  callback: Exclude<T, undefined | null>,
  _options: ThrottleDebounceOptions = {},
): T & { cancel: () => void } {
  assertValidDelay(delay)

  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  function wrapper(
    this: unknown,
    ...args: Parameters<Exclude<T, null | undefined>>
  ) {
    cancel()
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      callback.apply(this, args)
    }, delay)
  }

  wrapper.cancel = cancel

  return wrapper as T & { cancel: () => void }
}
