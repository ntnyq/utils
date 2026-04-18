---
title: Getting Started
outline: deep
---

# Getting Started

@ntnyq/utils is a lightweight TypeScript utility collection covering arrays, strings, objects, DOM helpers, numbers, type guards, and more.

## Installation

```bash
pnpm add @ntnyq/utils
```

## Basic Usage

```ts
import { chunk, cleanObject, slugify } from '@ntnyq/utils'

const list = chunk([1, 2, 3, 4], 2)
const value = cleanObject({ name: 'Alice', age: undefined })
const slug = slugify('Hello World')
```

## Module Categories

- Array utilities
- String utilities
- Object utilities
- Number utilities
- DOM and environment helpers
- Type guards and runtime checks
- Miscellaneous browser and timing helpers

## Tree Shaking

The package is ESM-only and marked as side-effect free, making it friendly to modern bundlers.

## Next Steps

- Browse the [API Reference](/api/)
- Start with the [String Utilities](/api/string) and [Object Utilities](/api/object) pages
