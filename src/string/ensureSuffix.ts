export function ensureSuffix(input: string, suffix: string): string {
  return input.endsWith(suffix) ? input : `${input}${suffix}`
}
