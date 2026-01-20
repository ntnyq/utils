import { describe, expect, it } from 'vitest'
import { escapeHTML, unescapeHTML } from '../src/html'

describe('escapeHTML', () => {
  it('should escape basic characters', () => {
    expect(escapeHTML('&')).toBe('&amp;')
    expect(escapeHTML('<')).toBe('&lt;')
    expect(escapeHTML('>')).toBe('&gt;')
    expect(escapeHTML("'")).toBe('&#39;')
    expect(escapeHTML('"')).toBe('&quot;')
  })

  it('should escape mixed string', () => {
    expect(escapeHTML('<div class="x">Tom & \'Jerry\'</div>')).toBe(
      '&lt;div class=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/div&gt;',
    )
  })
})

describe('unescapeHTML', () => {
  it('should unescape common entities', () => {
    expect(unescapeHTML('&amp;')).toBe('&')
    expect(unescapeHTML('&lt;')).toBe('<')
    expect(unescapeHTML('&gt;')).toBe('>')
    expect(unescapeHTML('&#39;')).toBe("'")
    expect(unescapeHTML('&quot;')).toBe('"')
  })

  it('should unescape alternative numeric entities', () => {
    expect(unescapeHTML('&#38;')).toBe('&')
    expect(unescapeHTML('&#60;')).toBe('<')
    expect(unescapeHTML('&#62;')).toBe('>')
    expect(unescapeHTML('&#34;')).toBe('"')
  })

  it('should unescape mixed string', () => {
    expect(
      unescapeHTML(
        '&lt;div class=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/div&gt;',
      ),
    ).toBe('<div class="x">Tom & \'Jerry\'</div>')
  })
})
