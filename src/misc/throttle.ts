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
 * @example
 *
 * ```typescript
 * import { throttle } from '@ntnyq/utils'
 *
 * const onResize = throttle(() => console.log('resized'), 200)
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

/**
 * Creates a debounced version of a function.
 * @param delay - The debounce delay in milliseconds.
 * @param callback - The function to debounce.
 * @param options - Additional debounce options.
 * @returns A debounced function with a cancel method.
 *
 * @example
 *
 * ```typescript
 * import { debounce } from '@ntnyq/utils'
 *
 * const onSearch = debounce(() => console.log('search'), 300)
 * onSearch()
 * ```
 */
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
