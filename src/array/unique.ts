export function unique<T>(val: T[]): T[] {
  return Array.from(new Set(val))
}
