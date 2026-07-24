---
title: JSON Utilities
outline: deep
---

# JSON Utilities

Helpers for defensive JSON serialization.

This section documents 1 exported method from the JSON module.

## Methods

- [safeStringify](#safestringify)

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
