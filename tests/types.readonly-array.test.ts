import { describe, expectTypeOf, it } from 'vitest'
import {
  chunk,
  filterFalsy,
  findLastIndex,
  flattenArrayable,
  intersect,
  isArrayEqual,
  mergeArrayable,
  pick,
  removeArrayItemInPlace,
  shuffleInPlace,
  unique,
} from '../src'
import type { ElementOf } from '../src'

describe('readonly array inputs', () => {
  it('should infer findLastIndex callback arguments and return a number', () => {
    const values = [1, 2, 3]
    const tuple = [1, 'a'] as const

    expectTypeOf(
      findLastIndex(values, (value, index, array) => {
        expectTypeOf(value).toEqualTypeOf<number>()
        expectTypeOf(index).toEqualTypeOf<number>()
        expectTypeOf(array).toEqualTypeOf<readonly number[]>()
        return value > 1
      }),
    ).toEqualTypeOf<number>()

    expectTypeOf(
      findLastIndex(
        tuple,
        (value, index, array) => {
          expectTypeOf(value).toEqualTypeOf<1 | 'a'>()
          expectTypeOf(array).toEqualTypeOf<readonly (1 | 'a')[]>()
          return index
        },
        -1,
      ),
    ).toEqualTypeOf<number>()
  })

  it('should preserve inference for mutable arrays', () => {
    const values = [1, 2]
    const tuple: [1, 2] = [1, 2]
    const objects = [{ id: 1 }]
    const mixed: (number | string)[] = [1, 'a']
    const optional: (number | undefined)[] = [1, undefined]
    const keys: ('id' | 'name')[] = ['id', 'name']

    expectTypeOf(unique(values)).toEqualTypeOf<number[]>()
    expectTypeOf(unique(tuple)).toEqualTypeOf<(1 | 2)[]>()
    expectTypeOf(unique(objects)).toEqualTypeOf<{ id: number }[]>()
    expectTypeOf(unique(mixed)).toEqualTypeOf<(number | string)[]>()
    expectTypeOf(chunk(values, 2)).toEqualTypeOf<number[][]>()
    expectTypeOf(intersect(tuple, values)).toEqualTypeOf<number[]>()
    expectTypeOf(filterFalsy(optional)).toEqualTypeOf<number[]>()
    expectTypeOf(
      pick({ id: 1, name: 'Alice', active: true }, keys),
    ).toEqualTypeOf<{ id: number; name: string }>()
    expectTypeOf(flattenArrayable([[1, 2], [3]])).toEqualTypeOf<number[]>()
    expectTypeOf(mergeArrayable(values, 3)).toEqualTypeOf<number[]>()
    expectTypeOf(mergeArrayable(optional)).toEqualTypeOf<
      (number | undefined)[]
    >()
  })

  it('should infer flattened elements and omit nullish scalar argument types', () => {
    expectTypeOf(flattenArrayable([1, [2, 3]])).toEqualTypeOf<number[]>()
    expectTypeOf(mergeArrayable([1, 2], undefined)).toEqualTypeOf<number[]>()
  })

  it('should accept readonly arrays and preserve mutable result types', () => {
    const values: readonly number[] = [1, 2, 2]
    const tuple = [1, 2, 2] as const
    const mixed = [0, 1, false, '', null, undefined] as const

    expectTypeOf(unique(values)).toEqualTypeOf<number[]>()
    expectTypeOf(unique(tuple)).toEqualTypeOf<(1 | 2)[]>()
    expectTypeOf(chunk(values, 2)).toEqualTypeOf<number[][]>()
    expectTypeOf(chunk(tuple, 2)).toEqualTypeOf<(1 | 2)[][]>()
    expectTypeOf(intersect(values, tuple)).toEqualTypeOf<number[]>()
    expectTypeOf(intersect(tuple, values)).toEqualTypeOf<number[]>()
    expectTypeOf(isArrayEqual(values, tuple)).toEqualTypeOf<boolean>()
    expectTypeOf(isArrayEqual(tuple, values)).toEqualTypeOf<boolean>()
    expectTypeOf(filterFalsy(mixed)).toEqualTypeOf<1[]>()
  })

  it('should infer element types when normalizing readonly arrays', () => {
    const values: readonly number[] = [1, 2]
    const tuple = [1, 2] as const
    const nested = [1, [2, 3]] as const

    expectTypeOf(flattenArrayable(values)).toEqualTypeOf<number[]>()
    expectTypeOf(flattenArrayable(tuple)).toEqualTypeOf<(1 | 2)[]>()
    expectTypeOf(flattenArrayable(nested)).toEqualTypeOf<(1 | 2 | 3)[]>()
    expectTypeOf(flattenArrayable<number>(nested)).toEqualTypeOf<number[]>()
    expectTypeOf(mergeArrayable(values, 3, null, undefined)).toEqualTypeOf<
      number[]
    >()
    expectTypeOf(mergeArrayable(tuple)).toEqualTypeOf<(1 | 2)[]>()
    expectTypeOf(mergeArrayable<number>(tuple, [3])).toEqualTypeOf<number[]>()
    expectTypeOf(flattenArrayable([[1, 2], [3]])).toEqualTypeOf<number[]>()
    expectTypeOf(mergeArrayable([1, 2], 3)).toEqualTypeOf<number[]>()
  })

  it('should accept readonly property keys', () => {
    const keys = ['id', 'name'] as const
    const result = pick({ id: 1, name: 'Alice', active: true }, keys)

    expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }>()
  })

  it('should extract readonly array and tuple elements', () => {
    expectTypeOf<ElementOf<readonly number[]>>().toEqualTypeOf<number>()
    expectTypeOf<ElementOf<readonly [1, 'a']>>().toEqualTypeOf<1 | 'a'>()
    expectTypeOf<ElementOf<readonly []>>().toEqualTypeOf<never>()
    expectTypeOf<
      ElementOf<readonly string[] | null | undefined>
    >().toEqualTypeOf<string>()
  })

  it('should require mutable arrays for in-place operations', () => {
    expectTypeOf<readonly number[]>().not.toExtend<
      Parameters<typeof shuffleInPlace<number>>[0]
    >()
    expectTypeOf<readonly number[]>().not.toExtend<
      Parameters<typeof removeArrayItemInPlace<number>>[0]
    >()
  })
})
