import { removeFileExtension } from './extension'

export interface GetFileNameOptions {
  /**
   * Whether to include the file extension in the result.
   *
   * @default true
   */
  includeExtension?: boolean
}

/**
 * Gets the filename from a file path or URL.
 *
 * Query strings and URL fragments are excluded from the result.
 *
 * @param filePath - The file path or URL to get the filename from.
 * @param options - Options that control whether the extension is included.
 * @returns The filename, or an empty string when the path has no filename.
 *
 * @example
 *
 * ```typescript
 * import { getFileName } from '@ntnyq/utils'
 *
 * getFileName('/documents/report.pdf') // => 'report.pdf'
 * getFileName('/documents/report.pdf', { includeExtension: false }) // => 'report'
 * ```
 */
export function getFileName(
  filePath: string,
  options: GetFileNameOptions = {},
): string {
  const { includeExtension = true } = options
  const queryIndex = filePath.indexOf('?')
  const fragmentIndex = filePath.indexOf('#')
  const suffixIndexes = [queryIndex, fragmentIndex].filter(index => index >= 0)
  const suffixIndex =
    suffixIndexes.length === 0 ? filePath.length : Math.min(...suffixIndexes)
  const pathWithoutSuffix = filePath.slice(0, suffixIndex)
  const filename = pathWithoutSuffix.slice(
    Math.max(
      pathWithoutSuffix.lastIndexOf('/'),
      pathWithoutSuffix.lastIndexOf('\\'),
    ) + 1,
  )

  return includeExtension ? filename : removeFileExtension(filename)
}
