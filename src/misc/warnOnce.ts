const warned = new Set<string>()

export const warnOnce = (message: string) => {
  if (warned.has(message)) {
    return
  }
  warned.add(message)
  console.warn(message)
}
