/**
 * Creates a proxy that enhances an object with additional fallback properties.
 * @module proxy
 * @param module - The original object to proxy.
 * @param extra - Additional properties to expose through the proxy.
 * @returns A proxy object that reads from the extra object before the original object.
 *
 * @example
 *
 * ```typescript
 * import { enhance } from '@ntnyq/utils'
 *
 * const target = { a: 1 }
 * const proxy = enhance(target, { b: 2 })
 * console.log(proxy.b) // => 2
 * ```
 */

export function enhance<
  T extends Record<PropertyKey, any>,
  E extends Record<PropertyKey, any>,
>(module: T, extra: E): T {
  return new Proxy(module, {
    get(target, key, receiver) {
      if (Reflect.has(extra, key)) {
        return Reflect.get(extra, key, receiver)
      }
      return Reflect.get(target, key, receiver)
    },
    has(target, key) {
      return Reflect.has(extra, key) || Reflect.has(target, key)
    },
  })
}
