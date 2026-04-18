/**
 * Removes the file extension from a filename.
 *
 * @param filename - The filename to remove the extension from.
 * @returns The filename without the extension.
 * @example
 *
 * ```typescript
 * import { removeFileExtension } from '@ntnyq/utils'
 *
 * const result = removeFileExtension('archive.tar.gz')
 * console.log(result) // => 'archive.tar'
 * ```
 *
 */
export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

/**
 * Gets the file extension from a filename.
 * @param filePath - The filePath to get the extension from.
 * @returns The file extension, or undefined if there is none.
 * @example
 *
 * ```typescript
 * import { getFileExtension } from '@ntnyq/utils'
 *
 * const result = getFileExtension('photo.jpg')
 * console.log(result) // => 'jpg'
 * ```
 *
 */
export function getFileExtension(filePath?: string): string | undefined {
  if (!filePath) {
    return undefined
  }
  const match = filePath.match(/\.([^.]+)$/)
  return match?.[1]
}
