import { expect, it } from 'vitest'
import { intersect, toArray } from '../src/array'

it('toArray', () => {
  expect(toArray()).toEqual([])
})

it('intersect', () => {
  expect(
    intersect(
      ['a', 'b', 1, true, undefined, {}],
      ['a', 'b', 1, true, undefined, {}],
    ),
  ).toMatchInlineSnapshot(`
    [
      "a",
      "b",
      1,
      true,
      undefined,
    ]
  `)
})
