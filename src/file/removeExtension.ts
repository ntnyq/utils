/**
 * Removes the file extension from a filename.
 *
 * @param filename The filename to remove the extension from.
 * @returns The filename without the extension.
 */
export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}
