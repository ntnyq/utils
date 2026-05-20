import { describe, expect, it } from 'vitest'
import { Color } from '../src/color'

describe('color', () => {
  it('color', () => {
    expect(Color.fromHex('#000').toHexString()).toMatchInlineSnapshot(
      `"#000000"`,
    )
    expect(Color.fromHex('#000').toRGBAString()).toMatchInlineSnapshot(
      `"rgba(0, 0, 0, 1)"`,
    )
    expect(Color.fromRGB(0, 0, 0).toHexString()).toMatchInlineSnapshot(
      `"#000000"`,
    )
    expect(
      Color.fromRGB(255, 255, 255).withAlpha(0.2).toRGBAString(),
    ).toMatchInlineSnapshot(`"rgba(255, 255, 255, 0.2)"`)

    expect(
      Color.fromHex('#000').lighten(20).toRGBAString(),
    ).toMatchInlineSnapshot(`"rgba(51, 51, 51, 1)"`)
    expect(
      Color.fromHex('#000').lighten(100).toRGBAString(),
    ).toMatchInlineSnapshot(`"rgba(255, 255, 255, 1)"`)
    expect(
      Color.fromRGB(255, 255, 255).darken(50).toRGBAString(),
    ).toMatchInlineSnapshot(`"rgba(127, 127, 127, 1)"`)
  })
})
