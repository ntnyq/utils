export function once<T extends unknown[]>(func: (...args: T) => void) {
  let called = false
  return function (this: unknown, ...args: T): boolean {
    if (called) {
      return false
    }
    called = true
    func.apply(this, args)
    return true
  }
}
