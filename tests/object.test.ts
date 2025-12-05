import { expect, it } from 'vitest'
import { pick } from '../src/object'

it('pick', () => {
  const obj = { a: 1, b: 2, c: 3, d: 4 }

  expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  expect(pick(obj, ['b', 'd'])).toEqual({ b: 2, d: 4 })
  expect(pick(obj, [])).toEqual({})

  // Pick non-existent keys
  expect(pick(obj, ['a', 'e' as keyof typeof obj])).toEqual({ a: 1 })

  // Pick from nested object
  const nested = { x: 1, y: { z: 2 }, w: 'test' }
  expect(pick(nested, ['x', 'y'])).toEqual({ x: 1, y: { z: 2 } })
})
