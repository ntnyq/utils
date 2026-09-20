export interface MemoizeOptions<Args extends unknown[], Key> {
  /** Resolves a cache key from arguments. */
  resolver?: (...args: Args) => Key

  /** Maximum cache size. When exceeded, the oldest entry is evicted. */
  maxSize?: number
}

export type MemoizedFunction<Fn extends (...args: any[]) => any> = ((
  this: ThisParameterType<Fn>,
  ...args: Parameters<Fn>
) => ReturnType<Fn>) & {
  cache: Map<unknown, ReturnType<Fn>>
  clear: () => void
}

interface DefaultCacheEntry {
  args: readonly unknown[]
  receiver: unknown
  key: object
}

function findDefaultKey(
  entries: readonly DefaultCacheEntry[],
  receiver: unknown,
  args: readonly unknown[],
): object | undefined {
  return entries.find(
    entry =>
      Object.is(entry.receiver, receiver) &&
      entry.args.length === args.length &&
      entry.args.every((arg, index) => Object.is(arg, args[index])),
  )?.key
}

/**
 * Memoizes a function with collision-free default argument identity matching,
 * optional custom key resolution, and an optional cache size limit.
 * @param func - Function to memoize.
 * @param options - Memoize options.
 * @returns Memoized function with cache helpers.
 */
export function memoize<Fn extends (...args: any[]) => any, Key = unknown>(
  func: Fn,
  options: MemoizeOptions<Parameters<Fn>, Key> = {},
): MemoizedFunction<Fn> {
  const { resolver, maxSize } = options

  if (maxSize !== undefined && (!Number.isInteger(maxSize) || maxSize <= 0)) {
    throw new RangeError('Memoize maxSize must be a positive integer')
  }

  const cache = new Map<unknown, ReturnType<Fn>>()
  const defaultEntries: DefaultCacheEntry[] = []

  const memoized = function memoizedFn(
    this: ThisParameterType<Fn>,
    ...args: Parameters<Fn>
  ) {
    let key: unknown
    let newEntry: DefaultCacheEntry | undefined
    if (resolver) {
      key = resolver(...args)
    } else {
      key = findDefaultKey(defaultEntries, this, args)
      if (key === undefined) {
        const newKey = {}
        key = newKey
        newEntry = { args: [...args], receiver: this, key: newKey }
      }
    }

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<Fn>
    }

    const value = func.apply(this, args) as ReturnType<Fn>
    cache.set(key, value)
    if (newEntry) {
      defaultEntries.push(newEntry)
    }

    if (maxSize !== undefined && cache.size > maxSize) {
      const oldestKey = cache.keys().next().value
      cache.delete(oldestKey)
      const entryIndex = defaultEntries.findIndex(
        entry => entry.key === oldestKey,
      )
      if (entryIndex !== -1) {
        defaultEntries.splice(entryIndex, 1)
      }
    }

    return value
  } as MemoizedFunction<Fn>

  memoized.cache = cache
  memoized.clear = () => {
    cache.clear()
    defaultEntries.length = 0
  }

  return memoized
}
