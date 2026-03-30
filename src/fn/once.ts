/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls to the function return `false`.
 *
 * @param func - The function to restrict.
 * @returns A new function that returns `true` when `func` is invoked for the first time and `false` on subsequent calls.
 *
 * @example
 *
 * ```ts
 * const initialize = once(() => {
 *   console.log('Initialized')
 * })
 *
 * initialize() // Logs: 'Initialized', returns true
 * ```
 */

export function once<T extends unknown[]>(
  func: (...args: T) => void,
): (...args: T) => boolean {
  let called = false
  // oxlint-disable-next-line func-names
  return function (this: unknown, ...args: T): boolean {
    if (called) {
      return false
    }
    called = true
    func.apply(this, args)
    return true
  }
}
