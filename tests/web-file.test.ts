import { describe, expect, it } from 'vitest'
import { validateFile } from '../src/web'

describe(validateFile, () => {
  it('should validate size, MIME type, and extension constraints', () => {
    const file = new File(['data'], 'quarterly-report.PDF', {
      type: 'application/pdf',
    })

    expect(
      validateFile(file, {
        allowedExtensions: ['pdf'],
        allowedMimeTypes: ['application/pdf'],
        maxSize: 10,
        minSize: 1,
      }),
    ).toStrictEqual({
      file,
      isValid: true,
      issues: [],
    })
  })

  it('should report every failed built-in constraint by default', () => {
    const file = new File(['12345678'], 'report.pdf', {
      type: 'application/pdf',
    })

    expect(
      validateFile(file, {
        allowedExtensions: ['.png'],
        allowedMimeTypes: ['image/*'],
        maxSize: 4,
      }),
    ).toStrictEqual({
      file,
      isValid: false,
      issues: [
        {
          code: 'file-too-large',
          actual: 8,
          expected: 4,
        },
        {
          code: 'invalid-mime-type',
          actual: 'application/pdf',
          expected: ['image/*'],
        },
        {
          code: 'invalid-extension',
          actual: 'report.pdf',
          expected: ['.png'],
        },
      ],
    })
  })

  it('should support MIME wildcards and compound extensions', () => {
    const file = new File(['archive'], 'backup.TAR.GZ', {
      type: 'application/gzip',
    })

    expect(
      validateFile(file, {
        allowedExtensions: ['tar.gz'],
        allowedMimeTypes: ['application/*'],
      }).isValid,
    ).toBeTruthy()
  })

  it('should stop after the first issue when configured', () => {
    const file = new File(['1234'], 'report.pdf', {
      type: 'application/pdf',
    })

    expect(
      validateFile(file, {
        allowedExtensions: ['png'],
        maxSize: 1,
        stopAtFirstIssue: true,
      }).issues,
    ).toStrictEqual([
      {
        code: 'file-too-large',
        actual: 4,
        expected: 1,
      },
    ])
  })

  it('should support typed custom validation rules', () => {
    interface ScannedFile extends File {
      scanStatus: 'clean' | 'infected'
    }

    const file = Object.assign(new File(['data'], 'report.pdf'), {
      scanStatus: 'infected' as const,
    })
    const result = validateFile<ScannedFile, 'infected-file'>(file, {
      rules: [
        receivedFile =>
          receivedFile.scanStatus === 'infected'
            ? {
                code: 'infected-file',
                actual: receivedFile.scanStatus,
                expected: 'clean',
              }
            : undefined,
      ],
    })

    expect(result.file).toBe(file)
    expect(result.issues).toStrictEqual([
      {
        code: 'infected-file',
        actual: 'infected',
        expected: 'clean',
      },
    ])
  })

  it('should reject invalid constraints', () => {
    const file = new File([], 'empty.txt')

    expect(() => validateFile(file, { minSize: -1 })).toThrow(RangeError)
    expect(() => validateFile(file, { maxSize: 1.5 })).toThrow(RangeError)
    expect(() => validateFile(file, { minSize: 2, maxSize: 1 })).toThrow(
      RangeError,
    )
    expect(() => validateFile(file, { allowedExtensions: [''] })).toThrow(
      TypeError,
    )
  })
})
