/**
 * enhance object
 * @module proxy
 */

export function enhance<
  T extends Record<PropertyKey, any>,
  E extends Record<PropertyKey, any>,
>(module: T, extra: E): T {
  return new Proxy(module, {
    get(target, key, receiver) {
      if (Reflect.has(extra, key)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Reflect.get(extra, key, receiver)
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, key, receiver)
    },
    has(target, key) {
      return Reflect.has(extra, key) || Reflect.has(target, key)
    },
  })
}
