/**
 * check object has a property with given key
 * @param object - the object to check
 * @param key - the key to check
 * @returns true if object has a property with given key, false otherwise
 */
export function hasOwn<T>(object: T, key: PropertyKey): boolean {
  if (object === null) {
    return false
  }
  // oxlint-disable-next-line prefer-object-has-own
  return Object.prototype.hasOwnProperty.call(object, key)
}
