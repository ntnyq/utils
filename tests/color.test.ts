import { describe, expect, it } from 'vitest'
import {
  Color,
  randomHexColor,
  randomRGBAColor,
  randomRGBColor,
} from '../src/color'

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

describe('random color helpers', () => {
  it('randomRGBColor should return valid rgb color string', () => {
    const color = randomRGBColor()
    const match =
      /^rgb\((?<red>\d{1,3}), (?<green>\d{1,3}), (?<blue>\d{1,3})\)$/u.exec(
        color,
      )

    expect(match).not.toBeNull()

    const groups = match?.groups
    expect(groups).toBeDefined()

    const channels = [
      Number.parseInt(groups!['red']!, 10),
      Number.parseInt(groups!['green']!, 10),
      Number.parseInt(groups!['blue']!, 10),
    ]

    channels.forEach(channel => {
      expect(channel).toBeGreaterThanOrEqual(0)
      expect(channel).toBeLessThanOrEqual(255)
    })
  })

  it('randomRGBAColor should return valid rgba color string', () => {
    const color = randomRGBAColor()
    const match =
      /^rgba\((?<red>\d{1,3}), (?<green>\d{1,3}), (?<blue>\d{1,3}), (?<alpha>0(?:\.\d)?|1(?:\.0)?)\)$/u.exec(
        color,
      )

    expect(match).not.toBeNull()

    const groups = match?.groups
    expect(groups).toBeDefined()

    const alpha = Number.parseFloat(groups!['alpha']!)
    expect(alpha).toBeGreaterThanOrEqual(0)
    expect(alpha).toBeLessThanOrEqual(1)
  })

  it('randomHexColor should return valid hex color string', () => {
    const color = randomHexColor()

    expect(color).toMatch(/^#[\da-f]{1,6}$/iu)
  })
})
