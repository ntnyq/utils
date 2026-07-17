import { describe, expectTypeOf, it } from 'vitest'
import { filterFalsy, groupBy } from '../src/array'
import { openExternalURL, scrollElementIntoView } from '../src/dom'
import type {
  GetImageNaturalSizeOptions,
  OpenExternalURLOptions,
  ScrollElementIntoViewOptions,
} from '../src/dom'
import {
  isDate,
  isNonEmptyMap,
  isNonEmptyObject,
  isNonEmptySet,
  isPrimitive,
  isWeakMap,
  isWeakSet,
} from '../src/is'
import { randomNumber, toInteger } from '../src/number'
import { deepMerge, objectOmit } from '../src/object'
import type { ObjectOmitOptions } from '../src/object'
import { enhance } from '../src/proxy'
import { flatTree } from '../src/tree'
import type { DeepRequired, ResolvedOptions } from '../src/types'

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

  it('should type boolean resolved options as an empty record', () => {
    expectTypeOf<ResolvedOptions<boolean>>().toEqualTypeOf<
      Record<PropertyKey, never>
    >()
    expectTypeOf<ResolvedOptions<{ enabled?: boolean }>>().toEqualTypeOf<{
      enabled?: boolean
    }>()
    expectTypeOf<ResolvedOptions<null>>().toEqualTypeOf<
      Record<PropertyKey, never>
    >()
  })

  it('should expose corrected utility result types', () => {
    const token = Symbol('token')
    const filtered = filterFalsy([token, 0n, 1n] as (symbol | 0n | 1n)[])
    const enhanced = enhance({ value: 1 }, { value: 'one', extra: true })
    const original = toInteger('bad', { onError: 'returnOriginal' })

    expectTypeOf(filtered).toEqualTypeOf<(symbol | 1n)[]>()
    expectTypeOf(enhanced.value).toEqualTypeOf<string>()
    expectTypeOf(enhanced.extra).toEqualTypeOf<boolean>()
    expectTypeOf(original).toEqualTypeOf<number | string>()
    expectTypeOf(toInteger('1')).toEqualTypeOf<number>()
  })

  it('should narrow collection and primitive checks', () => {
    const date: unknown = new Date()
    const map: unknown = new Map<string, number>([['one', 1]])
    const objectValue: unknown = { key: 'value' }
    const primitive: unknown = 'value'
    const set: unknown = new Set<string>(['value'])
    const weakMap: unknown = new WeakMap<object, number>()
    const weakSet: unknown = new WeakSet<object>()

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
    if (isWeakMap<object, number>(weakMap)) {
      expectTypeOf(weakMap).toEqualTypeOf<WeakMap<object, number>>()
    }
    if (isWeakSet<object>(weakSet)) {
      expectTypeOf(weakSet).toEqualTypeOf<WeakSet<object>>()
    }
  })

  it('should infer mapped trees and property grouping', () => {
    const nodes = [{ id: 1, children: [] }] as const
    const flattened = flatTree(nodes, {
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

  it('should export public option types and the corrected random option name', () => {
    expectTypeOf<GetImageNaturalSizeOptions>().toBeObject()
    expectTypeOf<OpenExternalURLOptions>().toBeObject()
    expectTypeOf<ScrollElementIntoViewOptions>().toBeObject()
    expectTypeOf<ObjectOmitOptions>().toBeObject()
    expectTypeOf(openExternalURL).toBeFunction()
    expectTypeOf(scrollElementIntoView).toBeFunction()
    expectTypeOf(objectOmit).toBeFunction()
    expectTypeOf(randomNumber).toBeFunction()
  })
})
