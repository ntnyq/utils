import { describe, expect, it } from 'vitest'
import { unindent } from '../src/string'

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
