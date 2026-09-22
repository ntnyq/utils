# Color

Source: `docs/api/color.md`, `src/color/`, `tests/color.test.ts`.

```ts
import { Color, hexToRGB, lightenHexColor, rgbToHex } from '@ntnyq/utils'

hexToRGB('#369') // { red: 51, green: 102, blue: 153 }
rgbToHex({ red: 51, green: 102, blue: 153 }) // '#336699'
lightenHexColor('#336699', 20) // '#6699CC'
Color.fromHex('#336699').withAlpha(0.5).toRGBAString()
// 'rgba(51, 102, 153, 0.5)'
```

- `hexToRGB` and `hexToRGBString` accept `#RGB` and `#RRGGBB`; invalid input
  throws. They are not general CSS color parsers.
- `RGBColor` is a type with numeric `red`, `green`, and `blue` properties.
  `rgbToHex` takes that object, rounds channels, and clamps them to 0–255.
- `lightenHexColor` and `darkenHexColor` add/subtract a percentage of the full
  RGB range per channel. Percentages are clamped to 0–100; this is not an HSL
  lightness operation.
- `invertHexColor` subtracts each channel from 255.
- `Color` wraps normalized RGBA channels with conversion, brightness, alpha,
  lightening, and darkening methods.
- `randomHexColor`, `randomRGBColor`, and `randomRGBAColor` return CSS-style
  strings; RGB channels range from 0 through 255.
