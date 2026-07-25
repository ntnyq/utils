import { describe, expectTypeOf, it } from 'vitest'
import {
  filterFalsy,
  groupBy,
  removeArrayItem,
  removeArrayItemInPlace,
  shuffleInPlace,
  uniqueBy,
  uniqueWith,
} from '../src/array'
import {
  digitsToChinese,
  randomInteger,
  toChineseNumber,
  toInteger,
} from '../src/number'
import type { RandomIntegerOptions } from '../src/number'
import {
  cleanObjectInPlace,
  deepMerge,
  isKeyOf,
  objectOmit,
  omit,
  omitInPlace,
  sortObjectKeys,
} from '../src/object'
import type { ObjectOmitOptions, SortObjectKeysOptions } from '../src/object'
import {
  getObjectTag,
  isDate,
  isNonEmptyMap,
  isNonEmptyObject,
  isNonEmptySet,
  isPrimitive,
  isURLString,
  isWeakMap,
  isWeakSet,
  isWhitespaceString,
} from '../src/predicate'
import type { URLString, Whitespace } from '../src/predicate'
import { createOverlayProxy } from '../src/proxy'
import {
  calculateNGramSimilarity,
  countGraphemes,
  joinNonEmptyValues,
} from '../src/string'
import type { CalculateNGramSimilarityOptions } from '../src/string'
import { flattenTree } from '../src/tree'
import type { FlattenTreeContext, FlattenTreeOptions } from '../src/tree'
import type { DeepRequired } from '../src/types'
import {
  cancelFrame,
  getGlobalRoot,
  loadImageDimensions,
  openExternalURL,
  requestFrame,
  scrollElementIntoView,
} from '../src/web'
import type {
  LoadImageDimensionsOptions,
  OpenExternalURLOptions,
  ScrollElementIntoViewOptions,
} from '../src/web'

describe('public API types', () => {
  it('should preserve readonly arrays and tuples in DeepRequired', () => {
    interface Input {
      items?: readonly ({ name?: string | null } | null)[] | null
      tuple?: readonly [string | null, { count?: number | null }?]
    }
    interface Expected {
      items: readonly { name: string }[]
      tuple: readonly [string, { count: number }]
    }

    expectTypeOf<DeepRequired<Input>>().toEqualTypeOf<Expected>()
  })

  it('should expose corrected utility result types', () => {
    const token = Symbol('token')
    const filtered = filterFalsy([token, 0n, 1n] as (symbol | 0n | 1n)[])
    const overlaid = createOverlayProxy(
      { value: 1 },
      { value: 'one', extra: true },
    )
    const original = toInteger('bad', { onError: 'returnOriginal' })
    const object = { known: true }
    const objectKey = 'known' as string
    const uniqueIds = uniqueBy([{ id: 1 }], item => item.id)
    const uniqueObjects = uniqueWith(
      [{ id: 1 }],
      (left, right) => left.id === right.id,
    )

    expectTypeOf(filtered).toEqualTypeOf<(symbol | 1n)[]>()
    expectTypeOf(overlaid.value).toEqualTypeOf<string>()
    expectTypeOf(overlaid.extra).toEqualTypeOf<boolean>()
    expectTypeOf(original).toEqualTypeOf<number | string>()
    expectTypeOf(digitsToChinese('2026')).toEqualTypeOf<string>()
    expectTypeOf(toChineseNumber(2026)).toEqualTypeOf<string>()
    expectTypeOf(toInteger('1')).toEqualTypeOf<number>()
    expectTypeOf(uniqueIds).toEqualTypeOf<{ id: number }[]>()
    expectTypeOf(uniqueObjects).toEqualTypeOf<{ id: number }[]>()

    if (isKeyOf(object, objectKey)) {
      expectTypeOf(objectKey).toEqualTypeOf<'known'>()
      expectTypeOf(object[objectKey]).toEqualTypeOf<boolean>()
    }
  })

  it('should narrow collection and primitive checks', () => {
    const date: unknown = new Date()
    const map: unknown = new Map<string, number>([['one', 1]])
    const objectValue: unknown = { key: 'value' }
    const primitive: unknown = 'value'
    const set: unknown = new Set<string>(['value'])
    const url: unknown = 'https://example.com'
    const weakMap: unknown = new WeakMap<object, number>()
    const weakSet: unknown = new WeakSet<object>()
    const whitespace: unknown = '\t'

    if (isDate(date)) {
      expectTypeOf(date).toEqualTypeOf<Date>()
    }
    if (isNonEmptyMap<string, number>(map)) {
      expectTypeOf(map).toEqualTypeOf<Map<string, number>>()
    }
    if (isNonEmptyObject(objectValue)) {
      expectTypeOf(objectValue).toEqualTypeOf<object>()
    }
    if (isNonEmptySet<string>(set)) {
      expectTypeOf(set).toEqualTypeOf<Set<string>>()
    }
    if (isPrimitive(primitive)) {
      expectTypeOf(primitive).toEqualTypeOf<
        bigint | boolean | number | string | symbol | null | undefined
      >()
    }
    if (isURLString(url)) {
      expectTypeOf(url).toEqualTypeOf<URLString>()
    }
    if (isWeakMap<object, number>(weakMap)) {
      expectTypeOf(weakMap).toEqualTypeOf<WeakMap<object, number>>()
    }
    if (isWeakSet<object>(weakSet)) {
      expectTypeOf(weakSet).toEqualTypeOf<WeakSet<object>>()
    }
    if (isWhitespaceString(whitespace)) {
      expectTypeOf(whitespace).toEqualTypeOf<Whitespace>()
      expectTypeOf(whitespace).toMatchTypeOf<string>()
    }
  })

  it('should infer mapped trees and property grouping', () => {
    const nodes = [{ id: 1, children: [] }] as const
    const flattened = flattenTree(nodes, {
      map: ({ node, parent, path }) =>
        `${node.id}:${parent?.id ?? 0}:${path.length}`,
    })
    const grouped = groupBy(
      [
        { kind: 'a' as const, value: 1 },
        { kind: 'b' as const, value: 2 },
      ],
      'kind',
    )

    expectTypeOf(flattened).toEqualTypeOf<string[]>()
    expectTypeOf(grouped).toMatchTypeOf<
      Partial<Record<'a' | 'b', { kind: 'a' | 'b'; value: number }[]>>
    >()
  })

  it('should fold deep merge result types from left to right', () => {
    const merged = deepMerge(
      { config: { a: 1 as const } },
      { config: 2 as const },
      { config: { b: 3 as const } },
    )

    expectTypeOf(merged.config).toEqualTypeOf<{ readonly b: 3 }>()
  })

  it('should export public option types and renamed utilities', () => {
    interface TreeNode {
      children?: TreeNode[]
    }

    expectTypeOf<CalculateNGramSimilarityOptions>().toBeObject()
    expectTypeOf<FlattenTreeContext<TreeNode>>().toBeObject()
    expectTypeOf<FlattenTreeOptions<TreeNode, 'children'>>().toBeObject()
    expectTypeOf<LoadImageDimensionsOptions>().toBeObject()
    expectTypeOf<OpenExternalURLOptions>().toBeObject()
    expectTypeOf<RandomIntegerOptions>().toBeObject()
    expectTypeOf<ScrollElementIntoViewOptions>().toBeObject()
    expectTypeOf<SortObjectKeysOptions>().toBeObject()
    expectTypeOf<ObjectOmitOptions>().toBeObject()
    expectTypeOf(calculateNGramSimilarity).toBeFunction()
    expectTypeOf(cancelFrame).toBeFunction()
    expectTypeOf(cleanObjectInPlace).toBeFunction()
    expectTypeOf(countGraphemes).toBeFunction()
    expectTypeOf(flattenTree).toBeFunction()
    expectTypeOf(getGlobalRoot).toBeFunction()
    expectTypeOf(getObjectTag).toBeFunction()
    expectTypeOf(isURLString).toBeFunction()
    expectTypeOf(joinNonEmptyValues).toBeFunction()
    expectTypeOf(loadImageDimensions).toBeFunction()
    expectTypeOf(omit).toBeFunction()
    expectTypeOf(omitInPlace).toBeFunction()
    expectTypeOf(openExternalURL).toBeFunction()
    expectTypeOf(scrollElementIntoView).toBeFunction()
    expectTypeOf(objectOmit).toBeFunction()
    expectTypeOf(randomInteger).toBeFunction()
    expectTypeOf(removeArrayItem).toBeFunction()
    expectTypeOf(removeArrayItemInPlace).toBeFunction()
    expectTypeOf(requestFrame).toBeFunction()
    expectTypeOf(shuffleInPlace).toBeFunction()
    expectTypeOf(sortObjectKeys).toBeFunction()
  })
})
