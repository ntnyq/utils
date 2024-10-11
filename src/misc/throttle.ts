export function throttle<T extends ((...args: any[]) => undefined | void) | undefined | null>(
  delay: number,
  fn: Exclude<T, undefined | null>,
  _isDebounce?: boolean,
) {
  let lastExec = 0
  let cancelled = false
  let timer: ReturnType<typeof setTimeout> | null = null
  const clear = () => {
    timer = null
  }

  function wrapper(this: unknown, ...args: Parameters<Exclude<T, null | undefined>>) {
    if (cancelled) return
    const now = Date.now()
    const elapsed = now - lastExec
    const exec = (cur?: number) => {
      lastExec = cur || Date.now()
      fn.apply(this, args)
    }

    if (_isDebounce && !timer) {
      exec(now)
    }

    if (timer) {
      clearTimeout(timer)
    }

    if (!_isDebounce && elapsed > delay) {
      exec(now)
    } else {
      timer = setTimeout(_isDebounce ? clear : exec, _isDebounce ? delay : delay - elapsed)
    }
  }

  wrapper.cancel = () => {
    if (timer) {
      clearTimeout(timer)
    }
    clear()
    cancelled = true
  }

  return wrapper as T & { cancel: () => void }
}

export function debounce<T extends ((...args: any[]) => undefined | void) | undefined | null>(
  delay: number,
  fn: Exclude<T, undefined | null>,
) {
  return throttle(delay, fn, true)
}
