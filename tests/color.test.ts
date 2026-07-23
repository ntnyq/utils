import { describe, expect, it, vi } from 'vitest'
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

  it('should normalize channels and alpha into valid ranges', () => {
    const color = Color.fromRGBA(-10, 127.6, 300, 2)

    expect(color.toHexString()).toBe('#0080FF')
    expect(color.toRGBAString()).toBe('rgba(0, 128, 255, 1)')
    expect(Color.fromRGBA(Number.NaN, 0, 0, Number.NaN).toRGBAString()).toBe(
      'rgba(0, 0, 0, 0)',
    )
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
      Math.trunc(Number(groups!['red']!)),
      Math.trunc(Number(groups!['green']!)),
      Math.trunc(Number(groups!['blue']!)),
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

    const alpha = Number(groups!['alpha']!)
    expect(alpha).toBeGreaterThanOrEqual(0)
    expect(alpha).toBeLessThanOrEqual(1)
  })

  it('randomHexColor should return valid hex color string', () => {
    const color = randomHexColor()

    expect(color).toMatch(/^#[\da-f]{6}$/iu)
  })

  it('should include complete RGB and hexadecimal boundaries', () => {
    const random = vi.spyOn(Math, 'random')

    random.mockReturnValue(0)
    expect(randomRGBColor()).toBe('rgb(0, 0, 0)')
    expect(randomHexColor()).toBe('#000000')

    random.mockReturnValue(0.999_999_999_999_999_9)
    expect(randomRGBColor()).toBe('rgb(255, 255, 255)')
    expect(randomRGBAColor()).toBe('rgba(255, 255, 255, 1.0)')
    expect(randomHexColor()).toBe('#ffffff')

    random.mockRestore()
  })
})
