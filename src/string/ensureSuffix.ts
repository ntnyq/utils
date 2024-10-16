export function ensureSuffix(input: string, suffix: string) {
  return input.endsWith(suffix) ? input : `${input}${suffix}`
}
