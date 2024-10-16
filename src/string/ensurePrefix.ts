export function ensurePrefix(input: string, prefix: string) {
  return input.startsWith(prefix) ? input : `${prefix}${input}`
}
