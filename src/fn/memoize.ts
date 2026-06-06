export interface MemoizeOptions<Args extends unknown[], Key> {
  /**
   * Resolves a cache key from arguments.
   */
  resolver?: (...args: Args) => Key

  /**
   * Maximum cache size. When exceeded, the oldest entry is evicted.
   */
  maxSize?: number
}

export type MemoizedFunction<Fn extends (...args: any[]) => any> = ((
  ...args: Parameters<Fn>
) => ReturnType<Fn>) & {
  cache: Map<unknown, ReturnType<Fn>>
  clear: () => void
}

function defaultResolver(...args: unknown[]): unknown {
  if (args.length <= 1) {
    return args[0]
  }

  try {
    return JSON.stringify(args)
  } catch {
    return args.map(String).join('|')
  }
}

/**
 * Memoizes a function with optional custom key resolver and cache size limit.
 * @param func - Function to memoize.
 * @param options - Memoize options.
 * @returns Memoized function with cache helpers.
 *
 * @example
 *
 * ```typescript
 * import { memoize } from '@ntnyq/utils'
 *
 * const heavy = memoize((n: number) => n * n)
 * console.log(heavy(4)) // => 16
 * ```
 */
export function memoize<Fn extends (...args: any[]) => any, Key = unknown>(
  func: Fn,
  options: MemoizeOptions<Parameters<Fn>, Key> = {},
): MemoizedFunction<Fn> {
  const {
    resolver = defaultResolver as (...args: Parameters<Fn>) => Key,
    maxSize,
  } = options

  const cache = new Map<unknown, ReturnType<Fn>>()

  const memoized = function memoizedFn(this: unknown, ...args: Parameters<Fn>) {
    const key = resolver(...args)

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<Fn>
    }

    const value = func.apply(this, args) as ReturnType<Fn>
    cache.set(key, value)

    if (maxSize && maxSize > 0 && cache.size > maxSize) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
    }

    return value
  } as MemoizedFunction<Fn>

  memoized.cache = cache
  memoized.clear = () => {
    cache.clear()
  }

  return memoized
}
