export function hasOwnProperty<T, K extends keyof T>(object: T, key: K) {
  return Object.prototype.hasOwnProperty.call(object, key)
}
