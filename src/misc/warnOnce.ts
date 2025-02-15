const warned = new Set<string>()

export function warnOnce(message: string): void {
  if (warned.has(message)) {
    return
  }
  warned.add(message)
  console.warn(message)
}
