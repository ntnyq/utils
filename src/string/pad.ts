export interface CreatePadStringOptions {
  length: number
  char: string
}

/**
 * Creates a function that left-pads a string to a fixed length.
 * @param options - Padding options including target length and fill character.
 * @returns A function that pads incoming strings to the desired length.
 *
 * @example
 *
 * ```typescript
 * import { createPadString } from '@ntnyq/utils'
 *
 * const pad = createPadString({ length: 5, char: '0' })
 * console.log(pad('42')) // => '00042'
 * ```
 */
export function createPadString(
  options: CreatePadStringOptions,
): (value: string) => string {
  const { length, char } = options
  return (value: string) => (char.repeat(length) + value).slice(-length)
}
