---
title: Type Utilities
outline: deep
---

# Type Utilities

Reusable TypeScript-only exports for common values and type transformations.

## Base types

`AnyFn`, `Arrayable`, `Awaitable`, `Callable`, `MayBe`, `Nullable`, `Prettify`,
and `Primitive` describe frequently used value shapes.

## Deep and effect types

- `DeepRequired<T>` recursively removes optional and nullish values while
  preserving arrays and tuples.
- `Overwrite<T, U>` replaces or adds properties from `U`.
- `StrictOverwrite<T, U>` only permits keys already present in `T`.
- `Without<T, U>` and `Exclusive<T, U>` support mutually exclusive shapes.

## JSON and module types

`JsonArray`, `JsonObject`, `JsonPrimitive`, and `JsonValue` model JSON data.
`InteropModuleDefault<T>` models the default export returned from an imported module.

## General helpers

`LiteralUnion`, `NonEmptyObject`, `ValueOf`, and `ElementOf` provide common
inference and extraction patterns.

```ts
import type { Arrayable, DeepRequired } from '@ntnyq/utils'

type Input = Arrayable<string>
type Config = DeepRequired<{ nested?: { enabled?: boolean } }>
```
