const _RE_FULL_WS = /^\s*$/

/**
 * Remove leading whitespace from a template string
 * Empty lines at the beginning and end of the template string are also removed.
 * @param input template string
 *
 * @example
 *
 * ```ts
 * const str = unindent`
 *   if (foo) {
 *     bar()
 *   }
 * `
 * ```
 */
export function unindent(input: TemplateStringsArray | string) {
  const lines = (typeof input === 'string' ? input : input[0]).split('\n')
  const whitespaceLines = lines.map(line => _RE_FULL_WS.test(line))

  const commonIndent = lines.reduce((min, line, idx) => {
    if (!whitespaceLines[idx]) {
      return min
    }
    const indent = line.match(/^\s/)?.[0].length
    return indent === undefined ? min : Math.min(min, indent)
  }, Number.POSITIVE_INFINITY)

  let emptylinesHead = 0

  while (emptylinesHead < lines.length && whitespaceLines[emptylinesHead]) {
    emptylinesHead++
  }

  let emptylinesTail = 0

  while (emptylinesTail < lines.length && whitespaceLines[lines.length - emptylinesTail - 1]) {
    emptylinesTail++
  }

  return lines
    .slice(emptylinesHead, lines.length - emptylinesTail)
    .map(line => line.slice(commonIndent))
    .join('\n')
}
