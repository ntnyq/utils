import { describe, expect, it } from 'vitest'
import { removeFileExtension } from '../src/file/removeExtension'

describe('removeFileExtension', () => {
  it('should remove common file extensions', () => {
    expect(removeFileExtension('document.txt')).toBe('document')
    expect(removeFileExtension('image.jpg')).toBe('image')
    expect(removeFileExtension('script.js')).toBe('script')
    expect(removeFileExtension('style.css')).toBe('style')
    expect(removeFileExtension('data.json')).toBe('data')
    expect(removeFileExtension('readme.md')).toBe('readme')
  })

  it('should handle files with multiple dots', () => {
    expect(removeFileExtension('file.name.txt')).toBe('file.name')
    expect(removeFileExtension('my.config.json')).toBe('my.config')
    expect(removeFileExtension('version.1.2.3.tar.gz')).toBe(
      'version.1.2.3.tar',
    )
  })

  it('should handle files without extensions', () => {
    expect(removeFileExtension('filename')).toBe('filename')
    expect(removeFileExtension('README')).toBe('README')
    expect(removeFileExtension('Makefile')).toBe('Makefile')
  })

  it.skip('should handle files starting with dots', () => {
    expect(removeFileExtension('.gitignore')).toBe('.gitignore')
    expect(removeFileExtension('.env')).toBe('.env')
    expect(removeFileExtension('.bashrc')).toBe('.bashrc')
    expect(removeFileExtension('.hidden.txt')).toBe('.hidden')
  })

  it('should handle files with dots in directory path', () => {
    expect(removeFileExtension('path/to/file.txt')).toBe('path/to/file')
    expect(removeFileExtension('../config.json')).toBe('../config')
    expect(removeFileExtension('./src/index.js')).toBe('./src/index')
    expect(removeFileExtension('/home/user/.config/app.conf')).toBe(
      '/home/user/.config/app',
    )
  })

  it('should handle empty string and edge cases', () => {
    expect(removeFileExtension('')).toBe('')
    expect(removeFileExtension('.')).toBe('.')
    expect(removeFileExtension('..')).toBe('..')
    expect(removeFileExtension('...')).toBe('...')
  })

  it.skip('should handle files ending with dots', () => {
    expect(removeFileExtension('file.')).toBe('file')
    expect(removeFileExtension('document..')).toBe('document.')
    expect(removeFileExtension('name...')).toBe('name..')
  })

  it('should handle long extensions', () => {
    expect(removeFileExtension('file.backup')).toBe('file')
    expect(removeFileExtension('archive.tar.gz')).toBe('archive.tar')
    expect(removeFileExtension('component.test.js')).toBe('component.test')
  })

  it('should handle files with spaces', () => {
    expect(removeFileExtension('my file.txt')).toBe('my file')
    expect(removeFileExtension('file with spaces.doc')).toBe('file with spaces')
    expect(removeFileExtension('document name.pdf')).toBe('document name')
  })

  it('should handle special characters in filename', () => {
    expect(removeFileExtension('file@#$.txt')).toBe('file@#$')
    expect(removeFileExtension('file_name-1.js')).toBe('file_name-1')
    expect(removeFileExtension('file(1).png')).toBe('file(1)')
  })

  it('should handle Unicode characters', () => {
    expect(removeFileExtension('文件.txt')).toBe('文件')
    // cSpell: disable-next-line
    expect(removeFileExtension('файл.doc')).toBe('файл')
    expect(removeFileExtension('ファイル.pdf')).toBe('ファイル')
  })

  it('should handle case sensitivity', () => {
    expect(removeFileExtension('File.TXT')).toBe('File')
    expect(removeFileExtension('IMAGE.JPG')).toBe('IMAGE')
    expect(removeFileExtension('Script.JS')).toBe('Script')
  })
})
