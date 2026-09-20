import { describe, expect, expectTypeOf, it } from 'vitest'
// oxlint-disable-next-line import/no-namespace -- Inspect the complete public export surface.
import * as utils from '../src'

describe('public API exports', () => {
  it('should remove deprecated aliases from runtime and type exports', () => {
    const removedNames = [
      'objectOmit',
      'remove',
      'join',
      'getRoot',
      'rAF',
      'cAF',
    ] as const

    for (const name of removedNames) {
      expect(utils).not.toHaveProperty(name)
    }

    expectTypeOf<
      Extract<(typeof removedNames)[number], keyof typeof utils>
    >().toBeNever()
  })

  it('should expose all replacement utilities from the package entry', () => {
    expect(utils.omit).toBeTypeOf('function')
    expect(utils.removeArrayItemInPlace).toBeTypeOf('function')
    expect(utils.joinNonEmptyValues).toBeTypeOf('function')
    expect(utils.getGlobalRoot).toBeTypeOf('function')
    expect(utils.requestFrame).toBeTypeOf('function')
    expect(utils.cancelFrame).toBeTypeOf('function')
  })
})
