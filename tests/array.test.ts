import { describe, expect, it } from 'vitest'
import {
  at,
  chunk,
  flattenArrayable,
  intersect,
  isArrayEqual,
  last,
  mergeArrayable,
  remove,
  shuffle,
  toArray,
  unique,
  uniqueBy,
} from '../src/array'

describe(toArray, () => {
  it('should convert undefined to empty array', () => {
    expect(toArray()).toEqual([])
    expect(toArray(undefined)).toEqual([])
  })

  it('should convert null to empty array', () => {
    expect(toArray(null)).toEqual([])
  })

  it('should keep arrays as-is', () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(toArray([])).toEqual([])
  })

  it('should wrap non-array values in array', () => {
    expect(toArray(1)).toEqual([1])
    expect(toArray('hello')).toEqual(['hello'])
    expect(toArray(true)).toEqual([true])
    expect(toArray({ a: 1 })).toEqual([{ a: 1 }])
  })
})

describe(intersect, () => {
  it('should return intersecting items', () => {
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

  it('should return common elements', () => {
    expect(intersect([1, 2, 3, 4], [3, 4, 5, 6])).toEqual([3, 4])
    expect(intersect(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c'])
  })

  it('should return empty array when no intersection', () => {
    expect(intersect([1, 2, 3], [4, 5, 6])).toEqual([])
    expect(intersect([], [1, 2, 3])).toEqual([])
    expect(intersect([1, 2, 3], [])).toEqual([])
  })

  it('should handle empty arrays', () => {
    expect(intersect([], [])).toEqual([])
  })

  it('should handle duplicate elements', () => {
    expect(intersect([1, 1, 2, 2], [1, 2, 3])).toEqual([1, 1, 2, 2])
  })
})

describe(at, () => {
  it('should get item by positive index', () => {
    const arr = ['a', 'b', 'c', 'd']
    expect(at(arr, 0)).toBe('a')
    expect(at(arr, 1)).toBe('b')
    expect(at(arr, 2)).toBe('c')
    expect(at(arr, 3)).toBe('d')
  })

  it('should get item by negative index', () => {
    const arr = ['a', 'b', 'c', 'd']
    expect(at(arr, -1)).toBe('d')
    expect(at(arr, -2)).toBe('c')
    expect(at(arr, -3)).toBe('b')
    expect(at(arr, -4)).toBe('a')
  })

  it('should return undefined for out of bounds index', () => {
    const arr = ['a', 'b', 'c']
    expect(at(arr, 10)).toBeUndefined()
    expect(at(arr, -10)).toBeUndefined()
  })

  it('should return undefined for empty array', () => {
    expect(at([], 0)).toBeUndefined()
    expect(at([], -1)).toBeUndefined()
  })
})

describe(last, () => {
  it('should return last item of array', () => {
    expect(last([1, 2, 3])).toBe(3)
    expect(last(['a', 'b', 'c'])).toBe('c')
  })

  it('should return undefined for empty array', () => {
    expect(last([])).toBeUndefined()
  })

  it('should work with single element array', () => {
    expect(last([42])).toBe(42)
  })
})

describe(chunk, () => {
  it('should split array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })

  it('should handle chunk size equal to array length', () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]])
  })

  it('should handle chunk size larger than array length', () => {
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]])
  })

  it('should handle empty array', () => {
    expect(chunk([], 2)).toEqual([])
  })

  it('should handle chunk size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
  })

  it('should work with different types', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })
})

describe(unique, () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    expect(unique(['a', 'b', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('should handle empty array', () => {
    expect(unique([])).toEqual([])
  })

  it('should handle array with no duplicates', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('should keep first occurrence order', () => {
    expect(unique([3, 1, 2, 3, 1])).toEqual([3, 1, 2])
  })

  it('should handle mixed types', () => {
    expect(unique([1, '1', 2, '2', 1, '1'])).toEqual([1, '1', 2, '2'])
  })
})

describe(uniqueBy, () => {
  it('should remove duplicates by custom equality function', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]
    const result = uniqueBy(arr, (a, b) => a.id === b.id)
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should handle case-insensitive string comparison', () => {
    const arr = ['Apple', 'banana', 'APPLE', 'Banana', 'cherry']
    const result = uniqueBy(arr, (a, b) => a.toLowerCase() === b.toLowerCase())
    expect(result).toEqual(['Apple', 'banana', 'cherry'])
  })

  it('should handle empty array', () => {
    expect(uniqueBy([], () => true)).toEqual([])
  })

  it('should keep all items if equalFn always returns false', () => {
    const arr = [1, 2, 3]
    expect(uniqueBy(arr, () => false)).toEqual([1, 2, 3])
  })

  it('should keep only first item if equalFn always returns true', () => {
    const arr = [1, 2, 3]
    expect(uniqueBy(arr, () => true)).toEqual([1])
  })
})

describe(isArrayEqual, () => {
  it('should return true for equal arrays', () => {
    expect(isArrayEqual([1, 2, 3], [1, 2, 3])).toBeTruthy()
    expect(isArrayEqual(['a', 'b'], ['a', 'b'])).toBeTruthy()
    expect(isArrayEqual([], [])).toBeTruthy()
  })

  it('should return false for arrays with different lengths', () => {
    expect(isArrayEqual([1, 2, 3], [1, 2])).toBeFalsy()
    expect(isArrayEqual([1], [1, 2, 3])).toBeFalsy()
  })

  it('should return false for arrays with different values', () => {
    expect(isArrayEqual([1, 2, 3], [1, 2, 4])).toBeFalsy()
    expect(isArrayEqual(['a', 'b'], ['a', 'c'])).toBeFalsy()
  })

  it('should return false for arrays with same values in different order', () => {
    expect(isArrayEqual([1, 2, 3], [3, 2, 1])).toBeFalsy()
  })

  it('should use strict equality', () => {
    expect(isArrayEqual([1, 2], ['1', '2'])).toBeFalsy()
    expect(isArrayEqual([0], [false])).toBeFalsy()
  })

  it('should not deeply compare objects', () => {
    expect(isArrayEqual([{ a: 1 }], [{ a: 1 }])).toBeFalsy()
  })
})

describe(remove, () => {
  it('should remove item from array and return true', () => {
    const arr = [1, 2, 3, 4]
    expect(remove(arr, 3)).toBeTruthy()
    expect(arr).toEqual([1, 2, 4])
  })

  it('should remove only first occurrence', () => {
    const arr = [1, 2, 3, 2, 4]
    expect(remove(arr, 2)).toBeTruthy()
    expect(arr).toEqual([1, 3, 2, 4])
  })

  it('should return false when item not found', () => {
    const arr = [1, 2, 3]
    expect(remove(arr, 5)).toBeFalsy()
    expect(arr).toEqual([1, 2, 3])
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    expect(remove(arr, 1)).toBeFalsy()
    expect(arr).toEqual([])
  })

  it('should work with different types', () => {
    const arr = ['a', 'b', 'c']
    expect(remove(arr, 'b')).toBeTruthy()
    expect(arr).toEqual(['a', 'c'])
  })

  it('should return false for null array', () => {
    // @ts-expect-error testing edge case
    expect(remove(null, 1)).toBeFalsy()
  })
})

describe(shuffle, () => {
  it('should return array with same length', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle([...arr])
    expect(shuffled.length).toBe(arr.length)
  })

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle([...arr])
    expect(shuffled.toSorted()).toEqual(arr)
  })

  it('should handle empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('should handle single element array', () => {
    expect(shuffle([1])).toEqual([1])
  })

  it('should mutate original array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffle(arr)
    expect(result).toBe(arr) // same reference
  })

  it('should handle array with duplicate values', () => {
    const arr = [1, 1, 2, 2, 3]
    const shuffled = shuffle([...arr])
    expect(shuffled.toSorted()).toEqual([1, 1, 2, 2, 3])
  })
})

describe(flattenArrayable, () => {
  it('should flatten nested arrays', () => {
    expect(
      flattenArrayable([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([1, 2, 3, 4])
    expect(flattenArrayable([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
  })

  it('should handle undefined and null', () => {
    expect(flattenArrayable(undefined)).toEqual([])
    expect(flattenArrayable(null)).toEqual([])
  })

  it('should convert non-array to array and flatten', () => {
    expect(flattenArrayable(1)).toEqual([1])
    expect(flattenArrayable([1])).toEqual([1])
  })

  it('should handle empty arrays', () => {
    expect(flattenArrayable([])).toEqual([])
    expect(flattenArrayable([[]])).toEqual([])
  })

  it('should handle mixed nested structures', () => {
    expect(flattenArrayable([[1], 2, [3, [4]]])).toEqual([1, 2, 3, [4]])
  })
})

describe(mergeArrayable, () => {
  it('should merge multiple arrays', () => {
    expect(mergeArrayable([1, 2], [3, 4], [5, 6])).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('should handle single values', () => {
    expect(mergeArrayable(1, 2, 3)).toEqual([1, 2, 3])
  })

  it('should handle mixed arrays and single values', () => {
    expect(mergeArrayable([1, 2], 3, [4, 5])).toEqual([1, 2, 3, 4, 5])
  })

  it('should handle null and undefined', () => {
    expect(mergeArrayable(null, undefined, [1, 2])).toEqual([1, 2])
    expect(mergeArrayable([1], null, [2])).toEqual([1, 2])
  })

  it('should handle empty arrays', () => {
    expect(mergeArrayable([], [], [])).toEqual([])
  })

  it('should handle no arguments', () => {
    expect(mergeArrayable()).toEqual([])
  })

  it('should work with different types', () => {
    expect(mergeArrayable(['a'], 'b', ['c', 'd'])).toEqual(['a', 'b', 'c', 'd'])
  })
})
