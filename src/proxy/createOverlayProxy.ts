/**
 * Creates a proxy that overlays properties on a target object.
 * @module proxy
 * @param target - The original object to proxy.
 * @param overlay - Properties that take precedence over the target object.
 * @returns A proxy object that reads from the overlay before the target object.
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
  return new Proxy(target, {
    get(targetObject, key, receiver) {
      if (Reflect.has(overlay, key)) {
        return Reflect.get(overlay, key, receiver)
      }
      return Reflect.get(targetObject, key, receiver)
    },
    has(targetObject, key) {
      return Reflect.has(overlay, key) || Reflect.has(targetObject, key)
    },
  }) as Omit<Target, keyof Overlay> & Overlay
}
