/**
 * Creates a proxy that overlays properties on a target object.
 * @module proxy
 * @param target - The original object to proxy.
 * @param overlay - Properties that take precedence over the target object.
 * @returns A reflective proxy view that reads and enumerates overlay properties
 * before target properties.
 *
 * @example
 *
 * ```typescript
 * import { createOverlayProxy } from '@ntnyq/utils'
 *
 * const target = { a: 1 }
 * const proxy = createOverlayProxy(target, { b: 2 })
 * console.log(proxy.b) // => 2
 * ```
 */

export function createOverlayProxy<
  Target extends Record<PropertyKey, any>,
  Overlay extends Record<PropertyKey, any>,
>(target: Target, overlay: Overlay): Omit<Target, keyof Overlay> & Overlay {
  const proxyTarget = Object.create(Object.getPrototypeOf(target)) as Target

  return new Proxy(proxyTarget, {
    defineProperty(_proxyTarget, key, descriptor) {
      return Reflect.defineProperty(target, key, descriptor)
    },
    deleteProperty(_proxyTarget, key) {
      return Reflect.deleteProperty(target, key)
    },
    get(_proxyTarget, key, receiver) {
      if (Reflect.has(overlay, key)) {
        return Reflect.get(overlay, key, receiver)
      }
      return Reflect.get(target, key, receiver)
    },
    getOwnPropertyDescriptor(_proxyTarget, key) {
      const descriptor =
        Reflect.getOwnPropertyDescriptor(overlay, key) ??
        Reflect.getOwnPropertyDescriptor(target, key)

      return descriptor ? { ...descriptor, configurable: true } : undefined
    },
    has(_proxyTarget, key) {
      return Reflect.has(overlay, key) || Reflect.has(target, key)
    },
    ownKeys() {
      return [
        ...new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(overlay)]),
      ]
    },
    preventExtensions() {
      return false
    },
    set(_proxyTarget, key, value) {
      return Reflect.set(target, key, value)
    },
  }) as Omit<Target, keyof Overlay> & Overlay
}
