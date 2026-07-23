---
title: Color Utilities
outline: deep
---

# Color Utilities

Color value manipulation and random RGB, RGBA, and HEX generation.

This section documents 4 exports from the color module.

## Methods

- [Color](#color)
- [randomHexColor](#randomhexcolor)
- [randomRGBAColor](#randomrgbacolor)
- [randomRGBColor](#randomrgbcolor)

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
