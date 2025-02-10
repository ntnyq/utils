export interface CreatePadStringOptions {
  length: number
  char: string
}

export function createPadString(options: CreatePadStringOptions) {
  const { length, char } = options
  return (value: string) => (char.repeat(length) + value).slice(-length)
}
