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
| [Array](/api/array)         |      15 | Array normalization, grouping, comparison, and transformation. |
| [Async](/api/async)         |       1 | Promise-based timing helpers.                                  |
| [Color](/api/color)         |       4 | Color manipulation and random color generation.                |
| [Function](/api/function)   |       8 | Composition, memoization, throttling, and invocation control.  |
| [HTML](/api/html)           |       2 | HTML text escaping and unescaping.                             |
| [Logging](/api/logging)     |       1 | Controlled warning output.                                     |
| [Module](/api/module)       |       1 | Module interop.                                                |
| [Number](/api/number)       |       6 | Range, random, rounding, and coercion helpers.                 |
| [Object](/api/object)       |      13 | Object selection, paths, cloning, merging, and cleanup.        |
| [Path](/api/path)           |       3 | Pure path-string and extension helpers.                        |
| [Predicate](/api/predicate) |      50 | Runtime checks grouped by semantic concern.                    |
| [Proxy](/api/proxy)         |       1 | Proxy-based object enhancement.                                |
| [String](/api/string)       |      12 | String formatting, matching, and owned character constants.    |
| [Tree](/api/tree)           |       1 | Tree flattening.                                               |
| [Types](/api/types)         |      22 | Reusable TypeScript types.                                     |
| [Units](/api/units)         |       6 | Duration and byte-size conversions.                            |
| [Web](/api/web)             |       9 | Environment, DOM, image, and animation-frame helpers.          |

All utilities are ESM-first and tree-shakable. Import public APIs from
`@ntnyq/utils`; the source folders describe ownership rather than package
subpath exports.
