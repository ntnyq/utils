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
| [Array](/api/array)         |      22 | Array normalization, grouping, comparison, and transformation. |
| [Async](/api/async)         |       3 | Promise-based timing, retry, and concurrency helpers.          |
| [Color](/api/color)         |      11 | Color conversion, manipulation, and random generation.         |
| [Function](/api/function)   |       8 | Composition, memoization, throttling, and invocation control.  |
| [HTML](/api/html)           |       2 | HTML text escaping and unescaping.                             |
| [JSON](/api/json)           |       2 | Defensive JSON parsing and serialization.                      |
| [Logging](/api/logging)     |       1 | Controlled warning output.                                     |
| [Module](/api/module)       |       1 | Module interop.                                                |
| [Number](/api/number)       |       8 | Range, rounding, coercion, and Chinese numeral helpers.        |
| [Object](/api/object)       |      16 | Object selection, mapping, paths, cloning, and merging.        |
| [Path](/api/path)           |       4 | Pure filename, path-string, and extension helpers.             |
| [Predicate](/api/predicate) |      50 | Runtime checks grouped by semantic concern.                    |
| [Proxy](/api/proxy)         |       1 | Proxy-based object overlays.                                   |
| [String](/api/string)       |      13 | String formatting, matching, and owned character constants.    |
| [Tree](/api/tree)           |       8 | Tree construction, traversal, filtering, lookup, and mapping.  |
| [Types](/api/types)         |      22 | Reusable TypeScript types.                                     |
| [Units](/api/units)         |       6 | Duration and byte-size conversions.                            |
| [Web](/api/web)             |      10 | Environment, DOM, file, image, and animation-frame helpers.    |

All utilities are ESM-first and tree-shakable. Import public APIs from
`@ntnyq/utils`; the source folders describe ownership rather than package
subpath exports.

## Naming migration

- `uniqueBy` now accepts a key selector. Use `uniqueWith` for a binary equality
  function.
- `omit`, `cleanObject`, and `shuffle` now return new values. Use
  `omitInPlace`, `cleanObjectInPlace`, and `shuffleInPlace` when mutation is
  required.

### Removed deprecated aliases

The following deprecated exports have been removed. Update imports and calls
using this mapping; arguments and return values are unchanged.

| Removed export | Replacement                                                   |
| -------------- | ------------------------------------------------------------- |
| `objectOmit`   | [`omit`](/api/object#omit)                                    |
| `remove`       | [`removeArrayItemInPlace`](/api/array#removearrayiteminplace) |
| `join`         | [`joinNonEmptyValues`](/api/string#joinnonemptyvalues)        |
| `getRoot`      | [`getGlobalRoot`](/api/web#animation-frame)                   |
| `rAF`          | [`requestFrame`](/api/web#animation-frame)                    |
| `cAF`          | [`cancelFrame`](/api/web#animation-frame)                     |

`removeArrayItemInPlace` preserves the old `remove` behavior: it mutates the
source array and returns a boolean. Use `removeArrayItem` when a new array is
needed instead. `ObjectOmitOptions` remains available for `omit`.
