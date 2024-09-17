import { expect, it } from 'vitest'
import { toArray } from '../src/array'

it('toArray', () => {
  expect(toArray()).toEqual([])
})
