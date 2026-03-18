export interface ThrottleDebounceOptions {
  /**
   * @default false
   */
  isDebounce?: boolean
}

/**
 * Throttle a function to limit its execution to a maximum of once per a specified time interval.
 *
 * @param delay - Zero or greater delay in milliseconds
 * @param callback - A function to be throttled
 * @param options - throttle options
 * @returns A throttled function
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

  /**
   * Track the last time `callback` was executed
   */
  let lastExec = 0
  let cancelled = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined

  function clearExistingTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  function cancel() {
    clearExistingTimeout()
    cancelled = true
  }

  function wrapper(
    this: unknown,
    ...args: Parameters<Exclude<T, null | undefined>>
  ) {
    if (cancelled) {
      return
    }

    // oxlint-disable-next-line unicorn/no-this-assignment, typescript/no-this-alias
    const _this = this
    const now = Date.now()
    const elapsed = now - lastExec

    function clear() {
      timeoutId = undefined
    }

    function exec(cur?: number) {
      lastExec = cur || Date.now()
      callback.apply(_this, args)
    }

    if (isDebounce && !timeoutId) {
      exec(now)
    }

    clearExistingTimeout()

    if (!isDebounce && elapsed > delay) {
      exec(now)
    } else {
      timeoutId = setTimeout(
        isDebounce ? clear : exec,
        isDebounce ? delay : delay - elapsed,
      )
    }
  }

  wrapper.cancel = cancel

  return wrapper as T & { cancel: () => void }
}

export function debounce<
  // oxlint-disable-next-line typescript/no-invalid-void-type
  T extends ((...args: any[]) => undefined | void) | undefined | null,
>(
  delay: number,
  callback: Exclude<T, undefined | null>,
  options: ThrottleDebounceOptions = {},
): T & { cancel: () => void } {
  return throttle(delay, callback, {
    ...options,
    isDebounce: true,
  })
}
