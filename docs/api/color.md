---
title: Color Utilities
outline: deep
---

# Color Utilities

Color value manipulation, conversion, and random RGB, RGBA, and HEX
generation.

This section documents 11 exports from the color module.

## Methods

- [Color](#color)
- [RGBColor](#rgbcolor)
- [darkenHexColor](#darkenhexcolor)
- [hexToRGB](#hextorgb)
- [hexToRGBString](#hextorgbstring)
- [invertHexColor](#inverthexcolor)
- [lightenHexColor](#lightenhexcolor)
- [randomHexColor](#randomhexcolor)
- [randomRGBAColor](#randomrgbacolor)
- [randomRGBColor](#randomrgbcolor)
- [rgbToHex](#rgbtohex)

---

## Color

Represents an RGBA color with normalized channels and helpers for conversion,
brightness checks, alpha changes, lightening, and darkening.

### Example

```ts
import { Color } from '@ntnyq/utils'

const color = Color.fromHex('#336699').withAlpha(0.5)
console.log(color.toRGBAString()) // => rgba(51, 102, 153, 0.5)
```

---

## RGBColor

Represents numeric red, green, and blue channels.

```ts
interface RGBColor {
  red: number
  green: number
  blue: number
}
```

---

## darkenHexColor

Darkens a hexadecimal color by subtracting a percentage of the RGB range from
every channel. The percentage is clamped from 0 through 100.

```ts
import { darkenHexColor } from '@ntnyq/utils'

darkenHexColor('#336699', 20) // => '#003366'
```

---

## hexToRGB

Converts a `#RGB` or `#RRGGBB` hexadecimal color to numeric RGB channels.
Invalid hexadecimal colors throw an error.

```ts
import { hexToRGB } from '@ntnyq/utils'

hexToRGB('#369') // => { red: 51, green: 102, blue: 153 }
```

---

## hexToRGBString

Converts a `#RGB` or `#RRGGBB` hexadecimal color to a CSS RGB color string.
Invalid hexadecimal colors throw an error.

```ts
import { hexToRGBString } from '@ntnyq/utils'

hexToRGBString('#369') // => 'rgb(51, 102, 153)'
```

---

## invertHexColor

Inverts every RGB channel of a hexadecimal color.

```ts
import { invertHexColor } from '@ntnyq/utils'

invertHexColor('#123456') // => '#EDCBA9'
```

---

## lightenHexColor

Lightens a hexadecimal color by adding a percentage of the RGB range to every
channel. The percentage is clamped from 0 through 100.

```ts
import { lightenHexColor } from '@ntnyq/utils'

lightenHexColor('#336699', 20) // => '#6699CC'
```

---

## randomHexColor

Generates a six-digit random hexadecimal color from `#000000` through `#ffffff`.

### Returns

A six-digit random hexadecimal color.

### Example

```ts
import { randomHexColor } from '@ntnyq/utils'

const color = randomHexColor()
console.log(color) // => #a1b2c3
```

---

## randomRGBAColor

Generates a random RGBA color with RGB channels from 0 through 255.

### Returns

a random RGBA color

### Example

```ts
import { randomRGBAColor } from '@ntnyq/utils'

const color = randomRGBAColor()
console.log(color) // => rgba(12, 34, 56, 0.5)
```

---

## randomRGBColor

Generates a random RGB color with channels from 0 through 255.

### Returns

a random RGB color

### Example

```ts
import { randomRGBColor } from '@ntnyq/utils'

const color = randomRGBColor()
console.log(color) // => rgb(12, 34, 56)
```

---

## rgbToHex

Converts numeric RGB channels to a six-digit hexadecimal color. Channel values
are rounded and clamped from 0 through 255.

```ts
import { rgbToHex } from '@ntnyq/utils'

rgbToHex({ red: 51, green: 102, blue: 153 }) // => '#336699'
```
