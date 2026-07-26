---
title: JSON Utilities
outline: deep
---

# JSON Utilities

Helpers for defensive JSON parsing and serialization.

This section documents 2 exported methods from the JSON module.

## Methods

- [safeParse](#safeparse)
- [safeStringify](#safestringify)

---

## safeParse

Parses JSON without throwing for malformed input or reviver failures. The
returned discriminated union keeps successful JSON values separate from parse
errors without relying on a potentially ambiguous fallback.

```ts
import { safeParse } from '@ntnyq/utils'

const result = safeParse('{"name":"Alice"}')

if (result.success) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

Without a reviver, successful values are typed as `JsonValue`. Supplying a
reviver changes the result value to `unknown` because a reviver may produce any
JavaScript value.

---

## safeStringify

Serializes values while handling circular references, `bigint` values, and
`Error` objects. Serialization failures and top-level values that JSON cannot
represent return a configurable fallback string.

```ts
import { safeStringify } from '@ntnyq/utils'

const value: Record<string, unknown> = {
  count: 1n,
  error: new Error('Failed'),
}
value.self = value

const result = safeStringify(value)
// => '{"count":"1n","error":{"name":"Error",...},"self":"[Circular]"}'
```

Use `bigintSerializer`, `circularValue`, `errorSerializer`, or `replacer` to
customize normalization. The `space` option controls indentation, and
`fallback` accepts either a string or an error-aware function.
