import { isString } from '../is'

const RE_FULL_WS = /^\s*$/u

/**
 * Removes the common leading whitespace from a template string or plain string.
 * Empty lines at the beginning and end of the template string are also removed.
 * @param input - The template string or string value to normalize.
 * @returns The unindented string.
 *
 * @example
 *
 * ```typescript
 * import { unindent } from '@ntnyq/utils'
 *
 * const str = unindent`
 *   if (foo) {
 *     bar()
 *   }
 * `
 *
 * console.log(str)
 * ```
 */
export function unindent(input: TemplateStringsArray | string): string {
  const lines = (isString(input) ? input : input[0])?.split('\n') ?? []
  const whitespaceLines = lines.map(line => RE_FULL_WS.test(line))

  const commonIndent = lines.reduce((min, line, idx) => {
    if (whitespaceLines[idx]) {
      return min
    }
    const indent = line.match(/^\s*/u)?.[0].length
    return indent === undefined ? min : Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)

  let emptylinesHead = 0

  while (emptylinesHead < lines.length && whitespaceLines[emptylinesHead]) {
    emptylinesHead++
  }

  let emptylinesTail = 0

  while (
    emptylinesTail < lines.length &&
    whitespaceLines[lines.length - emptylinesTail - 1]
  ) {
    emptylinesTail++
  }

  return lines
    .slice(emptylinesHead, lines.length - emptylinesTail)
    .map(line => line.slice(commonIndent))
    .join('\n')
}
