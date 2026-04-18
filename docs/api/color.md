---
title: Color Utilities
outline: deep
---

# Color Utilities

Random color helpers for RGB, RGBA, and HEX color generation.

This section documents 3 exported methods from the color module.

## Methods

- [randomHexColor](#randomhexcolor)
- [randomRGBAColor](#randomrgbacolor)
- [randomRGBColor](#randomrgbcolor)

---

## randomHexColor

get a random hex color

### Returns

a random hex color

### Example

```ts
import { randomHexColor } from '@ntnyq/utils'

const color = randomHexColor()
console.log(color) // => #a1b2c3
```

---

## randomRGBAColor

get a random RGBA color

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

get a random RGB color

### Returns

a random RGB color

### Example

```ts
import { randomRGBColor } from '@ntnyq/utils'

const color = randomRGBColor()
console.log(color) // => rgb(12, 34, 56)
```
