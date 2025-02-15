export function ensurePrefix(input: string, prefix: string): string {
  return input.startsWith(prefix) ? input : `${prefix}${input}`
}
