import { describe, expect, it } from 'vitest'
import { getStringSimilarity, unindent } from '../src/string'

describe('unindent', () => {
  it('single line', () => {
    expect(unindent`
      Hello world
    `).toMatchInlineSnapshot(`"Hello world"`)
  })

  it('multi lines', () => {
    expect(
      unindent`
        if (a) {
          b()
        }
      `,
    ).toMatchInlineSnapshot(`
      "if (a) {
        b()
      }"
    `)
  })

  it('empty lines before and after', () => {
    expect(
      // eslint-disable-next-line antfu/indent-unindent
      unindent`


        if (a) {
          b()
        }


      `,
    ).toMatchInlineSnapshot(`
      "if (a) {
        b()
      }"
    `)
  })
})

describe('getStringSimilarity', () => {
  it('should return 1 for same string', () => {
    expect(getStringSimilarity('hello', 'hello')).toBe(1)
    expect(getStringSimilarity('hello', 'hello', { sliceLength: 2 })).toBe(1)
  })

  it('should return 0 for different string', () => {
    expect(getStringSimilarity('hello', 'world')).toBe(0)
  })

  it('should return 0 if either string is empty', () => {
    expect(getStringSimilarity('hello', '')).toBe(0)
    expect(getStringSimilarity('', 'hello')).toBe(0)
    expect(getStringSimilarity('', '')).toBe(0)
  })

  it('should caseSensitice works', () => {
    expect(getStringSimilarity('Hello', 'hello')).toBe(1)
  })

  it('should return strong match for rearranged words', () => {
    expect(
      getStringSimilarity('Lorem ipsum dolor', 'Dolor lorem ipsum'),
    ).toMatchInlineSnapshot(`0.875`)
  })

  it('Should return strong match for misspellings', () => {
    expect(
      getStringSimilarity('Lorem ipsum dolor', 'Lorem ipsum dlr'),
    ).toMatchInlineSnapshot(`0.8`)
  })
})
