---
title: API Reference
outline: deep
---

# API Reference

The public entry remains flat, while implementation ownership is organized by
domain so consumers can find browser-only and framework-agnostic utilities at a
glance.

| Category                    | Exports | Description                                                    |
| --------------------------- | ------: | -------------------------------------------------------------- |
| [Array](/api/array)         |      23 | Array normalization, grouping, comparison, and transformation. |
| [Async](/api/async)         |       3 | Promise-based timing, retry, and concurrency helpers.          |
| [Color](/api/color)         |       4 | Color manipulation and random color generation.                |
| [Function](/api/function)   |       8 | Composition, memoization, throttling, and invocation control.  |
| [HTML](/api/html)           |       2 | HTML text escaping and unescaping.                             |
| [JSON](/api/json)           |       2 | Defensive JSON parsing and serialization.                      |
| [Logging](/api/logging)     |       1 | Controlled warning output.                                     |
| [Module](/api/module)       |       1 | Module interop.                                                |
| [Number](/api/number)       |       8 | Range, rounding, coercion, and Chinese numeral helpers.        |
| [Object](/api/object)       |      17 | Object selection, mapping, paths, cloning, and merging.        |
| [Path](/api/path)           |       4 | Pure filename, path-string, and extension helpers.             |
| [Predicate](/api/predicate) |      50 | Runtime checks grouped by semantic concern.                    |
| [Proxy](/api/proxy)         |       1 | Proxy-based object overlays.                                   |
| [String](/api/string)       |      13 | String formatting, matching, and owned character constants.    |
| [Tree](/api/tree)           |       8 | Tree construction, traversal, filtering, lookup, and mapping.  |
| [Types](/api/types)         |      22 | Reusable TypeScript types.                                     |
| [Units](/api/units)         |       6 | Duration and byte-size conversions.                            |
| [Web](/api/web)             |      13 | Environment, DOM, file, image, and animation-frame helpers.    |

All utilities are ESM-first and tree-shakable. Import public APIs from
`@ntnyq/utils`; the source folders describe ownership rather than package
subpath exports.

## Naming migration

- `uniqueBy` now accepts a key selector. Use `uniqueWith` for a binary equality
  function.
- `omit`, `cleanObject`, and `shuffle` now return new values. Use
  `omitInPlace`, `cleanObjectInPlace`, and `shuffleInPlace` when mutation is
  required. `objectOmit` remains as a deprecated alias for `omit`.
- `removeArrayItem`, `joinNonEmptyValues`, `getGlobalRoot`, `requestFrame`, and
  `cancelFrame` are the descriptive public names. Their previous short names
  remain available as deprecated compatibility exports.
