// oxlint-disable eslint/id-length

type AnyFunction = (...args: any[]) => any

/**
 * Composes functions from right to left.
 */
export function compose(): <T>(value: T) => T
export function compose<A extends unknown[], R>(
  fn1: (...args: A) => R,
): (...args: A) => R
export function compose<A extends unknown[], B, R>(
  fn2: (arg: B) => R,
  fn1: (...args: A) => B,
): (...args: A) => R
export function compose<A extends unknown[], B, C, R>(
  fn3: (arg: C) => R,
  fn2: (arg: B) => C,
  fn1: (...args: A) => B,
): (...args: A) => R
export function compose<A extends unknown[], B, C, D, R>(
  fn4: (arg: D) => R,
  fn3: (arg: C) => D,
  fn2: (arg: B) => C,
  fn1: (...args: A) => B,
): (...args: A) => R
export function compose<A extends unknown[], B, C, D, E, R>(
  fn5: (arg: E) => R,
  fn4: (arg: D) => E,
  fn3: (arg: C) => D,
  fn2: (arg: B) => C,
  fn1: (...args: A) => B,
): (...args: A) => R
export function compose(...fns: AnyFunction[]): AnyFunction {
  if (fns.length === 0) {
    return (value: unknown) => value
  }

  if (fns.length === 1) {
    return fns[0]!
  }

  return (...args: unknown[]) => {
    const [lastFn, ...restFns] = [...fns].reverse()
    const initial = lastFn!(...args)
    return restFns.reduce((acc, fn) => fn(acc), initial)
  }
}

/**
 * Pipes functions from left to right.
 */
export function pipe(): <T>(value: T) => T
export function pipe<A extends unknown[], R>(
  fn1: (...args: A) => R,
): (...args: A) => R
export function pipe<A extends unknown[], B, R>(
  fn1: (...args: A) => B,
  fn2: (arg: B) => R,
): (...args: A) => R
export function pipe<A extends unknown[], B, C, R>(
  fn1: (...args: A) => B,
  fn2: (arg: B) => C,
  fn3: (arg: C) => R,
): (...args: A) => R
export function pipe<A extends unknown[], B, C, D, R>(
  fn1: (...args: A) => B,
  fn2: (arg: B) => C,
  fn3: (arg: C) => D,
  fn4: (arg: D) => R,
): (...args: A) => R
export function pipe<A extends unknown[], B, C, D, E, R>(
  fn1: (...args: A) => B,
  fn2: (arg: B) => C,
  fn3: (arg: C) => D,
  fn4: (arg: D) => E,
  fn5: (arg: E) => R,
): (...args: A) => R
export function pipe(...fns: AnyFunction[]): AnyFunction {
  if (fns.length === 0) {
    return (value: unknown) => value
  }

  if (fns.length === 1) {
    return fns[0]!
  }

  return (...args: unknown[]) => {
    const [firstFn, ...restFns] = fns
    const initial = firstFn!(...args)
    return restFns.reduce((acc, fn) => fn(acc), initial)
  }
}
