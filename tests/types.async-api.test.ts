import { describe, expectTypeOf, it } from 'vitest'
import { createDeferred } from '../src'
import type { Deferred } from '../src'

describe('async utility public API types', () => {
  it('should expose a typed deferred from the package entry', () => {
    const deferred = createDeferred<number>()

    expectTypeOf(deferred).toEqualTypeOf<Deferred<number>>()
    expectTypeOf(deferred.promise).toEqualTypeOf<Promise<number>>()
    expectTypeOf(deferred.resolve).toEqualTypeOf<
      (value: number | PromiseLike<number>) => void
    >()
    expectTypeOf(deferred.reject).toEqualTypeOf<(reason: unknown) => void>()

    deferred.resolve(1)
    deferred.resolve(Promise.resolve(2))
    expectTypeOf<PromiseLike<number>>().toExtend<
      Parameters<typeof deferred.resolve>[0]
    >()
  })

  it('should default an unspecified value type to unknown', () => {
    expectTypeOf(createDeferred()).toEqualTypeOf<Deferred<unknown>>()
    expectTypeOf<Deferred>().toEqualTypeOf<Deferred<unknown>>()
  })

  it('should allow void deferreds to resolve without an argument', () => {
    // oxlint-disable-next-line typescript/no-invalid-void-type -- Verify the no-result generic contract.
    const deferred = createDeferred<void>()
    deferred.resolve()

    expectTypeOf(deferred.promise).toEqualTypeOf<Promise<void>>()
  })

  it('should reject incompatible resolution values', () => {
    const deferred = createDeferred<number>()

    // @ts-expect-error numeric deferreds cannot resolve with a string
    deferred.resolve('invalid')
    // @ts-expect-error numeric deferreds require a value
    deferred.resolve()
    // @ts-expect-error promise-like values must resolve to the declared type
    deferred.resolve(Promise.resolve('invalid'))
  })
})
