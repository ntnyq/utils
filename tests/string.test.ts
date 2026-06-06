import { describe, expect, it } from 'vitest'
import {
  createPadString,
  ensurePrefix,
  ensureSuffix,
  escapeStringRegexp,
  getStringLength,
  getStringSimilarity,
  join,
  randomString,
  slash,
  slugify,
  truncate,
  unindent,
} from '../src/string'

describe(ensurePrefix, () => {
  it('should add prefix if not present', () => {
    expect(ensurePrefix('world', 'hello-')).toBe('hello-world')
    expect(ensurePrefix('test', 'pre-')).toBe('pre-test')
  })

  it('should not add prefix if already present', () => {
    expect(ensurePrefix('hello-world', 'hello-')).toBe('hello-world')
    expect(ensurePrefix('pre-test', 'pre-')).toBe('pre-test')
  })

  it('should handle empty string', () => {
    expect(ensurePrefix('', 'prefix-')).toBe('prefix-')
  })

  it('should handle empty prefix', () => {
    expect(ensurePrefix('test', '')).toBe('test')
  })
})

describe(ensureSuffix, () => {
  it('should add suffix if not present', () => {
    expect(ensureSuffix('hello', '-world')).toBe('hello-world')
    expect(ensureSuffix('test', '.txt')).toBe('test.txt')
  })

  it('should not add suffix if already present', () => {
    expect(ensureSuffix('hello-world', '-world')).toBe('hello-world')
    expect(ensureSuffix('test.txt', '.txt')).toBe('test.txt')
  })

  it('should handle empty string', () => {
    expect(ensureSuffix('', '-suffix')).toBe('-suffix')
  })

  it('should handle empty suffix', () => {
    expect(ensureSuffix('test', '')).toBe('test')
  })
})

describe(escapeStringRegexp, () => {
  it('should escape special regex characters', () => {
    expect(escapeStringRegexp('hello.world')).toBe(String.raw`hello\.world`)
    expect(escapeStringRegexp('a+b')).toBe(String.raw`a\+b`)
    expect(escapeStringRegexp('a*b')).toBe(String.raw`a\*b`)
    expect(escapeStringRegexp('a?b')).toBe(String.raw`a\?b`)
  })

  it('should escape brackets', () => {
    expect(escapeStringRegexp('[abc]')).toBe(String.raw`\[abc\]`)
    expect(escapeStringRegexp('(abc)')).toBe(String.raw`\(abc\)`)
    expect(escapeStringRegexp('{abc}')).toBe(String.raw`\{abc\}`)
  })

  it('should escape pipe and caret', () => {
    expect(escapeStringRegexp('a|b')).toBe(String.raw`a\|b`)
    expect(escapeStringRegexp('^abc')).toBe(String.raw`\^abc`)
  })

  it('should escape backslash and dollar', () => {
    expect(escapeStringRegexp(String.raw`a\b`)).toBe(String.raw`a\\b`)
    expect(escapeStringRegexp('$100')).toBe(String.raw`\$100`)
  })

  it('should escape hyphen', () => {
    // oxlint-disable-next-line unicorn/no-hex-escape, unicorn/escape-case
    expect(escapeStringRegexp('a-b')).toBe(String.raw`a\x2db`)
  })

  it('should handle empty string', () => {
    expect(escapeStringRegexp('')).toBe('')
  })
})

describe(getStringLength, () => {
  it('should count ASCII characters', () => {
    expect(getStringLength('hello')).toBe(5)
    expect(getStringLength('12345')).toBe(5)
    expect(getStringLength('')).toBe(0)
  })

  it('should count unicode characters correctly', () => {
    expect(getStringLength('emoji😀')).toBe(6)
    expect(getStringLength('你好')).toBe(2)
    expect(getStringLength('café')).toBe(4) // é is counted as one grapheme
  })

  it('should handle combining characters', () => {
    // e + combining accent
    const combinedChar = 'e\u0301'
    expect(getStringLength(combinedChar)).toBeLessThanOrEqual(2)
  })
})

describe(join, () => {
  it('should join array with default separator', () => {
    expect(join(['a', 'b', 'c'])).toBe('abc')
  })

  it('should join array with custom separator', () => {
    expect(join(['a', 'b', 'c'], { separator: '-' })).toBe('a-b-c')
    expect(join(['a', 'b', 'c'], { separator: ', ' })).toBe('a, b, c')
  })

  it('should filter out null and undefined', () => {
    expect(join(['a', null, 'b', undefined, 'c'])).toBe('abc')
    expect(join(['a', null, 'b', undefined, 'c'], { separator: '-' })).toBe(
      'a-b-c',
    )
  })

  it('should keep 0 and other falsy values', () => {
    expect(join([0, 1, 2], { separator: '-' })).toBe('0-1-2')
    // Empty strings are filtered out, not kept
    expect(join(['a', 'b'], { separator: '-' })).toBe('a-b')
  })

  it('should handle empty array', () => {
    expect(join([])).toBe('')
    expect(join([], { separator: '-' })).toBe('')
  })

  it('should handle single element', () => {
    expect(join(['a'])).toBe('a')
    expect(join([0])).toBe('0')
  })
})

describe(createPadString, () => {
  it('should pad string to specified length', () => {
    const pad = createPadString({ length: 5, char: '0' })
    expect(pad('1')).toBe('00001')
    expect(pad('12')).toBe('00012')
    expect(pad('123')).toBe('00123')
  })

  it('should truncate string if longer than length', () => {
    const pad = createPadString({ length: 3, char: '0' })
    expect(pad('12345')).toBe('345')
  })

  it('should handle different pad characters', () => {
    const pad = createPadString({ length: 5, char: '*' })
    expect(pad('a')).toBe('****a')
  })

  it('should keep string as-is if equal to length', () => {
    const pad = createPadString({ length: 3, char: '0' })
    expect(pad('abc')).toBe('abc')
  })
})

describe(randomString, () => {
  it('should generate string of specified length', () => {
    expect(randomString(10)).toHaveLength(10)
    expect(randomString(20)).toHaveLength(20)
    expect(randomString(1)).toHaveLength(1)
  })

  it('should use default length of 16', () => {
    expect(randomString()).toHaveLength(16)
  })

  it('should use custom charset', () => {
    const result = randomString(10, 'ABC')
    expect(result).toHaveLength(10)
    expect(/^[ABC]+$/u.test(result)).toBeTruthy()
  })

  it('should generate different strings', () => {
    const str1 = randomString(20)
    const str2 = randomString(20)
    expect(str1).not.toBe(str2)
  })

  it('should use default charset containing alphanumeric', () => {
    const result = randomString(100)
    expect(/[0-9a-z]/iu.test(result)).toBeTruthy()
  })
})

describe(slash, () => {
  it('should replace backslashes with slashes', () => {
    expect(slash(String.raw`a\b\c`)).toBe('a/b/c')
    expect(slash(String.raw`path\to\file`)).toBe('path/to/file')
  })

  it('should leave forward slashes unchanged', () => {
    expect(slash('a/b/c')).toBe('a/b/c')
  })

  it('should handle mixed slashes', () => {
    expect(slash(String.raw`a\b/c\d`)).toBe('a/b/c/d')
  })

  it('should handle empty string', () => {
    expect(slash('')).toBe('')
  })
})

describe(slugify, () => {
  it('should convert to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world')
    expect(slugify('hello  world')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('hello!@#$world')).toBe('hello-world')
    expect(slugify('hello & world')).toBe('hello-world')
  })

  it('should remove accents', () => {
    expect(slugify('café')).toBe('cafe')
    expect(slugify('naïve')).toBe('naive')
  })

  it('should handle multiple consecutive special chars', () => {
    expect(slugify('hello---world')).toBe('hello-world')
    expect(slugify('hello...world')).toBe('hello-world')
  })

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('-hello-world-')).toBe('hello-world')
  })

  it('should prefix with underscore if starts with number', () => {
    expect(slugify('123 hello')).toBe('_123-hello')
  })

  it('should handle complex cases', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('The Quick Brown Fox')).toBe('the-quick-brown-fox')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })
})

describe(unindent, () => {
  it('should remove common indentation', () => {
    expect(
      unindent`
        hello
        world
      `,
    ).toBe('hello\nworld')
  })

  it('should handle single line', () => {
    expect(unindent`
      Hello world
    `).toBe('Hello world')
  })

  it('should handle multi-line code', () => {
    expect(
      unindent`
        if (a) {
          b()
        }
      `,
    ).toBe('if (a) {\n  b()\n}')
  })

  it('should remove empty lines at start and end', () => {
    expect(
      unindent`
        hello
        world
      `,
    ).toBe('hello\nworld')
  })

  it('should preserve relative indentation', () => {
    expect(
      unindent`
        outer {
          inner
        }
      `,
    ).toBe('outer {\n  inner\n}')
  })

  it('should handle string input', () => {
    expect(unindent('  hello\n  world')).toBe('hello\nworld')
  })
})

describe(truncate, () => {
  it('should truncate from end by default', () => {
    expect(truncate('The quick brown fox', { maxLength: 10 })).toBe(
      'The qui...',
    )
  })

  it('should support custom suffix', () => {
    expect(truncate('Hello world', { maxLength: 8, suffix: '..' })).toBe(
      'Hello ..',
    )
  })

  it('should truncate from start', () => {
    expect(
      truncate('The quick brown fox', {
        maxLength: 10,
        position: 'start',
      }),
    ).toBe('...own fox')
  })

  it('should truncate from middle', () => {
    expect(
      truncate('The quick brown fox', {
        maxLength: 11,
        position: 'middle',
      }),
    ).toBe('The ... fox')
  })

  it('should preserve words when enabled', () => {
    expect(
      truncate('The quick brown fox', {
        maxLength: 13,
        preserveWords: true,
      }),
    ).toBe('The quick...')
  })

  it('should return input when shorter than maxLength', () => {
    expect(truncate('Hello', { maxLength: 10 })).toBe('Hello')
  })

  it('should return clipped suffix when maxLength is shorter than suffix', () => {
    expect(truncate('Hello world', { maxLength: 2 })).toBe('..')
  })
})

describe(getStringSimilarity, () => {
  it('should return 1 for same string', () => {
    expect(getStringSimilarity('hello', 'hello')).toBe(1)
    expect(getStringSimilarity('hello', 'hello', { sliceLength: 2 })).toBe(1)
  })

  it('should return 0 for different strings', () => {
    expect(getStringSimilarity('hello', 'world')).toBe(0)
  })

  it('should return 0 if either string is empty', () => {
    expect(getStringSimilarity('hello', '')).toBe(0)
    expect(getStringSimilarity('', 'hello')).toBe(0)
    expect(getStringSimilarity('', '')).toBe(0)
  })

  it('should be case-insensitive by default', () => {
    expect(getStringSimilarity('Hello', 'hello')).toBe(1)
    expect(getStringSimilarity('HELLO', 'hello')).toBe(1)
  })

  it('should be case-sensitive when specified', () => {
    expect(
      getStringSimilarity('Hello', 'hello', { caseSensitive: true }),
    ).toBeLessThan(1)
  })

  it('should return strong match for rearranged words', () => {
    expect(
      getStringSimilarity('Lorem ipsum dolor', 'Dolor lorem ipsum'),
    ).toBeGreaterThan(0.8)
  })

  it('should return strong match for misspellings', () => {
    expect(
      getStringSimilarity('Lorem ipsum dolor', 'Lorem ipsum dlr'),
    ).toBeGreaterThan(0.7)
  })

  it('should support custom sliceLength', () => {
    expect(
      getStringSimilarity('hello', 'hallo', { sliceLength: 1 }),
    ).toBeGreaterThan(0)
    expect(
      getStringSimilarity('hello', 'hallo', { sliceLength: 3 }),
    ).toBeGreaterThanOrEqual(0)
  })

  it('should return string length if too short for slice length', () => {
    expect(getStringSimilarity('a', 'b', { sliceLength: 3 })).toBe(0)
  })
})
