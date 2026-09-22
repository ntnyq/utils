---
name: ntnyq-utils
description: Use @ntnyq/utils in TypeScript and JavaScript projects for data transformations, async control flow, tree operations, runtime guards, and browser helpers. Use only when the target project already declares @ntnyq/utils as a dependency, or the user explicitly asks to install, use, or migrate to it.
---

# @ntnyq/utils

An ESM-only, tree-shakable utility library with TypeScript declarations.
This skill describes v0.23.0. When the installed version differs, check its
exports and declarations before applying version-specific guidance.

## When to Use

Apply this skill when the target project declares `@ntnyq/utils` as a
dependency, or the user explicitly asks to install, use, or migrate to it.
Generic utility tasks alone do not trigger this skill.

Check the target project's `package.json` dependency declarations. For
monorepos, check the target workspace package and its dependency configuration;
a declaration in another workspace package does not establish applicability.
Presence in `node_modules` or a lockfile alone is insufficient because the
package may be a transitive dependency.

Do not add `@ntnyq/utils` solely because this skill is available.

## Quick Start

When the user requests adopting the package, install it with the project's
package manager, for example:

```bash
pnpm add @ntnyq/utils
```

```ts
import { cleanObject, groupBy, slugify } from '@ntnyq/utils'

const groups = groupBy([{ team: 'docs', name: 'Alice' }], 'team')
const payload = cleanObject({ name: 'Alice', note: undefined })
const slug = slugify('Hello World') // 'hello-world'
```

Import values and types from `@ntnyq/utils`. Category folders are source
organization; paths such as `@ntnyq/utils/array` are not package exports.
Use `import type` for type-only exports. The package declares Node
`^22.19.0 || >=24.11.0`; browser-only calls need their corresponding Web APIs.

## Choose a Reference

Read only the references relevant to the task. Each contains package-specific
semantics and examples; confirm unusual edge cases against the matching source
and tests when working in the library repository.

| Task                                                | Utilities and behavior                                       | Reference                                |
| --------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Normalize, group, index, sort, or deduplicate lists | `toArray`, `groupBy`, `keyBy`, `orderBy`, `uniqueBy`         | [Array](references/api-array.md)         |
| Limit concurrency, retry, or wait                   | `mapAsync`, `retry`, `waitFor`; abort behavior               | [Async](references/api-async.md)         |
| Convert or adjust colors                            | `Color`, HEX/RGB conversion, random colors                   | [Color](references/api-color.md)         |
| Control function execution                          | `debounce`, `throttle`, `once`, `memoize`, `pipe`, `compose` | [Function](references/api-function.md)   |
| Escape HTML text                                    | `escapeHTML`, `unescapeHTML`                                 | [HTML](references/api-html.md)           |
| Parse or serialize JSON defensively                 | `safeParse`, `safeStringify`                                 | [JSON](references/api-json.md)           |
| Deduplicate warnings                                | `warnOnce`                                                   | [Logging](references/api-logging.md)     |
| Unwrap imported modules                             | `interopDefault`                                             | [Module](references/api-module.md)       |
| Convert and format numbers                          | `toInteger`, `toNumber`, `toFixed`, Chinese numerals         | [Number](references/api-number.md)       |
| Select, clean, merge, or update objects             | `pick`, `omit`, `cleanObject`, `deepMerge`, path helpers     | [Object](references/api-object.md)       |
| Process filenames and path strings                  | `getFileName`, extension helpers, `normalizePathSlashes`     | [Path](references/api-path.md)           |
| Narrow unknown values or compare data               | Type guards, emptiness checks, `isDeepEqual`                 | [Predicate](references/api-predicate.md) |
| Overlay an object's readable properties             | `createOverlayProxy`                                         | [Proxy](references/api-proxy.md)         |
| Format or compare text                              | `slugify`, `truncate`, graphemes, joining and padding        | [String](references/api-string.md)       |
| Build, search, filter, or transform trees           | `buildTree`, `listToTree`, traversal context                 | [Tree](references/api-tree.md)           |
| Express reusable TypeScript contracts               | `Arrayable`, `DeepRequired`, overwrite and JSON types        | [Types](references/api-types.md)         |
| Convert byte sizes or durations                     | Storage uses 1024; time values use milliseconds              | [Units](references/api-units.md)         |
| Work with DOM, files, images, or frames             | Environment checks and browser prerequisites                 | [Web](references/api-web.md)             |

## Compatibility Rules

- `uniqueBy(array, selector)` selects keys. For a two-argument equality
  callback, use `uniqueWith(array, equals)`.
- `omit`, `cleanObject`, `removeArrayItem`, and `shuffle` return new values.
  Choose their `InPlace` variants only when mutation is intended. In particular,
  `omit(object, keys)` takes an array, while `omitInPlace(object, ...keys)` takes
  rest arguments.
- `debounce(delay, callback)` and `throttle(delay, callback)` take milliseconds
  first. Both return callable functions with `.cancel()`.
- Narrow `safeParse` results with `result.success` before accessing `.value`
  or `.error`. It does not return the parsed value directly.
- Tree predicates receive a context object: use `({ node }) => ...`.
- Browser imports do not imply browser globals exist. Guard browser work with
  `isBrowser()`; animation-frame wrappers do not provide a timer fallback.

### Removed Names

| Removed export | Current export           | Call-site detail                                               |
| -------------- | ------------------------ | -------------------------------------------------------------- |
| `objectOmit`   | `omit`                   | Returns a new object                                           |
| `remove`       | `removeArrayItemInPlace` | Mutates and returns a boolean                                  |
| `join`         | `joinNonEmptyValues`     | Preserves zero while skipping empty strings and nullish values |
| `getRoot`      | `getGlobalRoot`          | Returns the current global root                                |
| `rAF`          | `requestFrame`           | Requires animation-frame support                               |
| `cAF`          | `cancelFrame`            | Cancels a frame by ID                                          |

## Sources

- [Repository](https://github.com/ntnyq/utils)
- [API documentation](https://github.com/ntnyq/utils/tree/main/docs/api)
- [Public entry point](https://github.com/ntnyq/utils/blob/main/src/index.ts)

For regeneration inside the source repository, use `skills/GENERATION.md`.
