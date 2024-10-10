export function omit<T, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
  keys.forEach(key => delete object[key])
  return object
}
