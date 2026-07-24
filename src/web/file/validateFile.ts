export type FileValidationCode =
  | 'file-too-large'
  | 'file-too-small'
  | 'invalid-extension'
  | 'invalid-mime-type'

export interface FileValidationIssue<Code extends string = FileValidationCode> {
  code: Code
  actual?: unknown
  expected?: unknown
}

export type FileValidationRule<FileType extends File, Code extends string> = (
  file: FileType,
) => FileValidationIssue<Code> | null | undefined

export interface ValidateFileOptions<
  FileType extends File = File,
  CustomCode extends string = never,
> {
  /**
   * Allowed filename extensions. Values may include or omit the leading dot.
   */
  allowedExtensions?: readonly string[]

  /**
   * Allowed MIME types. Wildcard groups such as `image/*` are supported.
   */
  allowedMimeTypes?: readonly string[]

  /**
   * Maximum file size in bytes.
   */
  maxSize?: number

  /**
   * Minimum file size in bytes.
   */
  minSize?: number

  /**
   * Additional project-specific validation rules.
   */
  rules?: readonly FileValidationRule<FileType, CustomCode>[]

  /**
   * Stops validation after the first issue.
   *
   * @default false
   */
  stopAtFirstIssue?: boolean
}

export interface ValidateFileResult<
  FileType extends File = File,
  Code extends string = FileValidationCode,
> {
  file: FileType
  isValid: boolean
  issues: FileValidationIssue<Code>[]
}

function assertValidSizeConstraint(
  size: number | undefined,
  optionName: string,
): void {
  if (
    size !== undefined &&
    (!Number.isFinite(size) || size < 0 || !Number.isInteger(size))
  ) {
    throw new RangeError(`${optionName} must be a non-negative integer`)
  }
}

function normalizeExtension(extension: string): string {
  const normalizedExtension = extension.trim().toLowerCase()
  if (!normalizedExtension) {
    throw new TypeError('Allowed file extensions must not be empty')
  }
  return normalizedExtension.startsWith('.')
    ? normalizedExtension
    : `.${normalizedExtension}`
}

function matchesMimeType(mimeType: string, allowedMimeType: string): boolean {
  const normalizedMimeType = mimeType.toLowerCase()
  const normalizedAllowedMimeType = allowedMimeType.trim().toLowerCase()

  if (normalizedAllowedMimeType === '*/*') {
    return true
  }

  if (normalizedAllowedMimeType.endsWith('/*')) {
    return normalizedMimeType.startsWith(normalizedAllowedMimeType.slice(0, -1))
  }

  return normalizedMimeType === normalizedAllowedMimeType
}

function getMinimumSizeIssue(
  file: File,
  minSize: number | undefined,
): FileValidationIssue | undefined {
  if (minSize === undefined || file.size >= minSize) {
    return undefined
  }
  return {
    code: 'file-too-small',
    actual: file.size,
    expected: minSize,
  }
}

function getMaximumSizeIssue(
  file: File,
  maxSize: number | undefined,
): FileValidationIssue | undefined {
  if (maxSize === undefined || file.size <= maxSize) {
    return undefined
  }
  return {
    code: 'file-too-large',
    actual: file.size,
    expected: maxSize,
  }
}

function getMimeTypeIssue(
  file: File,
  allowedMimeTypes: readonly string[],
): FileValidationIssue | undefined {
  const isAllowed =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.some(allowedMimeType =>
      matchesMimeType(file.type, allowedMimeType),
    )

  if (isAllowed) {
    return undefined
  }
  return {
    code: 'invalid-mime-type',
    actual: file.type,
    expected: allowedMimeTypes,
  }
}

function getExtensionIssue(
  file: File,
  allowedExtensions: readonly string[],
): FileValidationIssue | undefined {
  const normalizedExtensions = allowedExtensions.map(extension =>
    normalizeExtension(extension),
  )
  const normalizedFileName = file.name.toLowerCase()
  const isAllowed =
    normalizedExtensions.length === 0 ||
    normalizedExtensions.some(extension =>
      normalizedFileName.endsWith(extension),
    )

  if (isAllowed) {
    return undefined
  }
  return {
    code: 'invalid-extension',
    actual: file.name,
    expected: normalizedExtensions,
  }
}

/**
 * Validates a file against size, MIME type, and extension constraints.
 *
 * @param file - File to validate.
 * @param options - Validation constraints.
 * @returns A structured validation result.
 *
 * @example
 *
 * ```typescript
 * import { validateFile } from '@ntnyq/utils'
 *
 * const result = validateFile(file, {
 *   allowedExtensions: ['pdf'],
 *   allowedMimeTypes: ['application/pdf'],
 *   maxSize: 10 * 1024 * 1024,
 * })
 * ```
 */
export function validateFile<
  FileType extends File,
  CustomCode extends string = never,
>(
  file: FileType,
  options: ValidateFileOptions<FileType, CustomCode> = {},
): ValidateFileResult<FileType, FileValidationCode | CustomCode> {
  const {
    allowedExtensions = [],
    allowedMimeTypes = [],
    maxSize,
    minSize,
    rules = [],
    stopAtFirstIssue = false,
  } = options

  assertValidSizeConstraint(minSize, 'minSize')
  assertValidSizeConstraint(maxSize, 'maxSize')
  if (minSize !== undefined && maxSize !== undefined && minSize > maxSize) {
    throw new RangeError('minSize must not be greater than maxSize')
  }

  const issues: FileValidationIssue<FileValidationCode | CustomCode>[] = []
  const builtInIssueResolvers = [
    () => getMinimumSizeIssue(file, minSize),
    () => getMaximumSizeIssue(file, maxSize),
    () => getMimeTypeIssue(file, allowedMimeTypes),
    () => getExtensionIssue(file, allowedExtensions),
  ]

  for (const resolveIssue of builtInIssueResolvers) {
    const issue = resolveIssue()
    if (issue) {
      issues.push(issue)
      if (stopAtFirstIssue) {
        return { file, isValid: false, issues }
      }
    }
  }

  for (const rule of rules) {
    const issue = rule(file)
    if (issue) {
      issues.push(issue)
      if (stopAtFirstIssue) {
        return { file, isValid: false, issues }
      }
    }
  }

  return {
    file,
    isValid: issues.length === 0,
    issues,
  }
}
