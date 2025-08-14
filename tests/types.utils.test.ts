import { describe, expectTypeOf, it } from 'vitest'
import type { ElementOf } from '../src/types/utils'

describe('ElementOf', () => {
  it('should infer element type for array', () => {
    expectTypeOf<ElementOf<[1, 2, 3]>>().toEqualTypeOf<1 | 2 | 3>()
    expectTypeOf<ElementOf<string[]>>().toEqualTypeOf<string>()
    expectTypeOf<ElementOf<number[]>>().toEqualTypeOf<number>()
  })

  it('should return never for empty array', () => {
    expectTypeOf<ElementOf<[]>>().toEqualTypeOf<never>()
  })

  it('should return element type for array types with nullish', () => {
    expectTypeOf<ElementOf<string[] | undefined>>().toEqualTypeOf<string>()
    expectTypeOf<ElementOf<number[] | null>>().toEqualTypeOf<number>()
    expectTypeOf<
      ElementOf<boolean[] | undefined | null>
    >().toEqualTypeOf<boolean>()
  })

  it('should return never for null or undefined', () => {
    expectTypeOf<ElementOf<null>>().toEqualTypeOf<never>()
    expectTypeOf<ElementOf<undefined>>().toEqualTypeOf<never>()
  })

  it('should infer element type for tuple', () => {
    expectTypeOf<ElementOf<[1, 'a', true]>>().toEqualTypeOf<1 | 'a' | true>()
  })
})
