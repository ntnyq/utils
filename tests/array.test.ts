import { describe, expect, it } from 'vitest'
import {
  at,
  chunk,
  filterFalsy,
  flattenArrayable,
  groupBy,
  intersect,
  isArrayEqual,
  last,
  mergeArrayable,
  partition,
  remove,
  shuffle,
  toArray,
  unique,
  uniqueBy,
} from '../src/array'

describe(toArray, () => {
  it('should convert undefined to empty array', () => {
    expect(toArray()).toStrictEqual([])
    expect(toArray(undefined)).toStrictEqual([])
  })

  it('should convert null to empty array', () => {
    expect(toArray(null)).toStrictEqual([])
  })

  it('should keep arrays as-is', () => {
    expect(toArray([1, 2, 3])).toStrictEqual([1, 2, 3])
    expect(toArray([])).toStrictEqual([])
  })

  it('should wrap non-array values in array', () => {
    expect(toArray(1)).toStrictEqual([1])
    expect(toArray('hello')).toStrictEqual(['hello'])
    expect(toArray(true)).toStrictEqual([true])
    expect(toArray({ a: 1 })).toStrictEqual([{ a: 1 }])
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
    expect(intersect([1, 2, 3, 4], [3, 4, 5, 6])).toStrictEqual([3, 4])
    expect(intersect(['a', 'b', 'c'], ['b', 'c', 'd'])).toStrictEqual([
      'b',
      'c',
    ])
  })

  it('should return empty array when no intersection', () => {
    expect(intersect([1, 2, 3], [4, 5, 6])).toStrictEqual([])
    expect(intersect([], [1, 2, 3])).toStrictEqual([])
    expect(intersect([1, 2, 3], [])).toStrictEqual([])
  })

  it('should handle empty arrays', () => {
    expect(intersect([], [])).toStrictEqual([])
  })

  it('should handle duplicate elements', () => {
    expect(intersect([1, 1, 2, 2], [1, 2, 3])).toStrictEqual([1, 1, 2, 2])
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
    expect(chunk([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]])
    expect(chunk([1, 2, 3, 4, 5, 6], 2)).toStrictEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ])
  })

  it('should handle chunk size equal to array length', () => {
    expect(chunk([1, 2, 3], 3)).toStrictEqual([[1, 2, 3]])
  })

  it('should handle chunk size larger than array length', () => {
    expect(chunk([1, 2, 3], 5)).toStrictEqual([[1, 2, 3]])
  })

  it('should handle empty array', () => {
    expect(chunk([], 2)).toStrictEqual([])
  })

  it('should handle chunk size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toStrictEqual([[1], [2], [3]])
  })

  it('should work with different types', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toStrictEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })

  it('should reject non-positive and fractional chunk sizes', () => {
    expect(() => chunk([1, 2], 0)).toThrow(RangeError)
    expect(() => chunk([1, 2], -1)).toThrow(RangeError)
    expect(() => chunk([1, 2], 1.5)).toThrow(RangeError)
  })
})

describe(unique, () => {
  it('should remove duplicate primitives', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toStrictEqual([1, 2, 3])
    expect(unique(['a', 'b', 'b', 'c'])).toStrictEqual(['a', 'b', 'c'])
  })

  it('should handle empty array', () => {
    expect(unique([])).toStrictEqual([])
  })

  it('should handle array with no duplicates', () => {
    expect(unique([1, 2, 3])).toStrictEqual([1, 2, 3])
  })

  it('should keep first occurrence order', () => {
    expect(unique([3, 1, 2, 3, 1])).toStrictEqual([3, 1, 2])
  })

  it('should handle mixed types', () => {
    expect(unique([1, '1', 2, '2', 1, '1'])).toStrictEqual([1, '1', 2, '2'])
  })
})

describe(uniqueBy, () => {
  it('should remove duplicates by custom equality function', () => {
    const arr = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]
    const result = uniqueBy(arr, (a, b) => a.id === b.id)
    expect(result).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should handle case-insensitive string comparison', () => {
    const arr = ['Apple', 'banana', 'APPLE', 'Banana', 'cherry']
    const result = uniqueBy(arr, (a, b) => a.toLowerCase() === b.toLowerCase())
    expect(result).toStrictEqual(['Apple', 'banana', 'cherry'])
  })

  it('should handle empty array', () => {
    expect(uniqueBy([], () => true)).toStrictEqual([])
  })

  it('should keep all items if equalFn always returns false', () => {
    const arr = [1, 2, 3]
    expect(uniqueBy(arr, () => false)).toStrictEqual([1, 2, 3])
  })

  it('should keep only first item if equalFn always returns true', () => {
    const arr = [1, 2, 3]
    expect(uniqueBy(arr, () => true)).toStrictEqual([1])
  })
})

describe(filterFalsy, () => {
  it('should retain truthy symbols and remove bigint zero', () => {
    const token = Symbol('token')
    expect(filterFalsy([token, 0n, 1n])).toStrictEqual([token, 1n])
  })

  it('should filter out falsy values', () => {
    const mixedArray = [0, 1, false, 2, '', 3, null, 4, undefined, 5]
    expect(filterFalsy(mixedArray)).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('should handle array with all falsy values', () => {
    const falsyArray = [0, false, '', null, undefined]
    expect(filterFalsy(falsyArray)).toStrictEqual([])
  })

  it('should handle array with all truthy values', () => {
    const truthyArray = [1, 'hello', true, 2, 'world']
    expect(filterFalsy(truthyArray)).toStrictEqual([
      1,
      'hello',
      true,
      2,
      'world',
    ])
  })

  it('should handle empty array', () => {
    expect(filterFalsy([])).toStrictEqual([])
  })

  it('should keep objects and arrays even though they are truthy', () => {
    const arr = [0, { a: 1 }, [], 1, null]
    expect(filterFalsy(arr)).toStrictEqual([{ a: 1 }, [], 1])
  })

  it('should handle NaN as falsy', () => {
    const arr = [1, Number.NaN, 2, 3]
    expect(filterFalsy(arr)).toStrictEqual([1, 2, 3])
  })
})

describe(groupBy, () => {
  it('should group by the value of a property key', () => {
    const data = [
      { kind: 'fruit', name: 'apple' },
      { kind: 'vegetable', name: 'carrot' },
      { kind: 'fruit', name: 'pear' },
    ] as const

    expect(groupBy(data, 'kind')).toStrictEqual({
      fruit: [data[0], data[2]],
      vegetable: [data[1]],
    })
  })

  it('should safely group special and symbol keys', () => {
    const symbol = Symbol('group')
    const values = ['__proto__', symbol] as const
    const result = groupBy(values, value => value)

    expect(Object.hasOwn(result, '__proto__')).toBeTruthy()
    expect(Reflect.get(result, '__proto__')).toStrictEqual(['__proto__'])
    expect(result[symbol]).toStrictEqual([symbol])
  })

  it('should group by function that returns age value', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 30 },
    ]
    const result = groupBy(data, item => String(item.age))
    expect(result).toStrictEqual({
      '25': [{ name: 'Bob', age: 25 }],
      '30': [
        { name: 'Alice', age: 30 },
        { name: 'Charlie', age: 30 },
      ],
    })
  })

  it('should group by function that returns string property', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 30 },
    ]
    const result = groupBy(data, item => item.name.length)
    expect(result).toStrictEqual({
      '3': [{ name: 'Bob', age: 25 }],
      '5': [{ name: 'Alice', age: 30 }],
      '7': [{ name: 'Charlie', age: 30 }],
    })
  })

  it('should handle empty array', () => {
    expect(groupBy([], 'key')).toStrictEqual({})
  })

  it('should group by function with different types', () => {
    const data = [
      { id: 1, type: 'a' },
      { id: 2, type: 'b' },
      { id: 3, type: 'a' },
    ]
    const result = groupBy(data, item => item.type)
    expect(result).toStrictEqual({
      a: [
        { id: 1, type: 'a' },
        { id: 3, type: 'a' },
      ],
      b: [{ id: 2, type: 'b' }],
    })
  })

  it('should work with primitive array using function', () => {
    const data = ['apple', 'banana', 'apricot', 'blueberry']
    const result = groupBy(data, item => item[0]!)
    expect(result).toStrictEqual({
      a: ['apple', 'apricot'],
      b: ['banana', 'blueberry'],
    })
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
    expect(arr).toStrictEqual([1, 2, 4])
  })

  it('should remove only first occurrence', () => {
    const arr = [1, 2, 3, 2, 4]
    expect(remove(arr, 2)).toBeTruthy()
    expect(arr).toStrictEqual([1, 3, 2, 4])
  })

  it('should return false when item not found', () => {
    const arr = [1, 2, 3]
    expect(remove(arr, 5)).toBeFalsy()
    expect(arr).toStrictEqual([1, 2, 3])
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    expect(remove(arr, 1)).toBeFalsy()
    expect(arr).toStrictEqual([])
  })

  it('should work with different types', () => {
    const arr = ['a', 'b', 'c']
    expect(remove(arr, 'b')).toBeTruthy()
    expect(arr).toStrictEqual(['a', 'c'])
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
    expect(shuffled).toHaveLength(arr.length)
  })

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle([...arr])
    expect(shuffled.toSorted()).toStrictEqual(arr)
  })

  it('should handle empty array', () => {
    expect(shuffle([])).toStrictEqual([])
  })

  it('should handle single element array', () => {
    expect(shuffle([1])).toStrictEqual([1])
  })

  it('should mutate original array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffle(arr)
    expect(result).toBe(arr) // same reference
  })

  it('should handle array with duplicate values', () => {
    const arr = [1, 1, 2, 2, 3]
    const shuffled = shuffle([...arr])
    expect(shuffled.toSorted()).toStrictEqual([1, 1, 2, 2, 3])
  })
})

describe(flattenArrayable, () => {
  it('should flatten nested arrays', () => {
    expect(
      flattenArrayable([
        [1, 2],
        [3, 4],
      ]),
    ).toStrictEqual([1, 2, 3, 4])
    expect(flattenArrayable([1, [2, 3], 4])).toStrictEqual([1, 2, 3, 4])
  })

  it('should handle undefined and null', () => {
    expect(flattenArrayable(undefined)).toStrictEqual([])
    expect(flattenArrayable(null)).toStrictEqual([])
  })

  it('should convert non-array to array and flatten', () => {
    expect(flattenArrayable(1)).toStrictEqual([1])
    expect(flattenArrayable([1])).toStrictEqual([1])
  })

  it('should handle empty arrays', () => {
    expect(flattenArrayable([])).toStrictEqual([])
    expect(flattenArrayable([[]])).toStrictEqual([])
  })

  it('should handle mixed nested structures', () => {
    expect(flattenArrayable([[1], 2, [3, [4]]])).toStrictEqual([1, 2, 3, [4]])
  })
})

describe(mergeArrayable, () => {
  it('should merge multiple arrays', () => {
    expect(mergeArrayable([1, 2], [3, 4], [5, 6])).toStrictEqual([
      1, 2, 3, 4, 5, 6,
    ])
  })

  it('should handle single values', () => {
    expect(mergeArrayable(1, 2, 3)).toStrictEqual([1, 2, 3])
  })

  it('should handle mixed arrays and single values', () => {
    expect(mergeArrayable([1, 2], 3, [4, 5])).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('should handle null and undefined', () => {
    expect(mergeArrayable(null, undefined, [1, 2])).toStrictEqual([1, 2])
    expect(mergeArrayable([1], null, [2])).toStrictEqual([1, 2])
  })

  it('should handle empty arrays', () => {
    expect(mergeArrayable([], [], [])).toStrictEqual([])
  })

  it('should handle no arguments', () => {
    expect(mergeArrayable()).toStrictEqual([])
  })

  it('should work with different types', () => {
    expect(mergeArrayable(['a'], 'b', ['c', 'd'])).toStrictEqual([
      'a',
      'b',
      'c',
      'd',
    ])
  })
})

describe(partition, () => {
  it('should split array by predicate in one pass', () => {
    const [even, odd] = partition([1, 2, 3, 4, 5], value => value % 2 === 0)

    expect(even).toStrictEqual([2, 4])
    expect(odd).toStrictEqual([1, 3, 5])
  })

  it('should provide index and source array to predicate', () => {
    const source = ['a', 'b', 'c']
    const [matched, unmatched] = partition(
      source,
      (_value, index, array) => index === 0 || array.length === 3,
    )

    expect(matched).toStrictEqual(['a', 'b', 'c'])
    expect(unmatched).toStrictEqual([])
  })

  it('should support type guard predicate', () => {
    const values: (number | string)[] = [1, '2', 3, '4']
    const [numbers, strings] = partition(
      values,
      (value): value is number => typeof value === 'number',
    )

    expect(numbers).toStrictEqual([1, 3])
    expect(strings).toStrictEqual(['2', '4'])
  })

  it('should handle empty array', () => {
    const [matched, unmatched] = partition([], () => true)

    expect(matched).toStrictEqual([])
    expect(unmatched).toStrictEqual([])
  })
})
