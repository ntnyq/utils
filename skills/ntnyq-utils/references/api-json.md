# JSON

Source: `docs/api/json.md`, `src/json/`, `tests/json.test.ts`.

## Parsing

```ts
import { safeParse } from '@ntnyq/utils'

const result = safeParse('{"name":"Alice"}')
if (result.success) {
  console.log(result.value)
} else {
  console.error(result.error)
}
```

`safeParse(text, { reviver }?)` returns a discriminated result, including for
valid JSON `null`.
Malformed input and reviver errors become failure results. Without a reviver,
success values have type `JsonValue`; with a reviver they are `unknown` because
the reviver can return arbitrary JavaScript values. Validate application shape
separately; parsing does not establish a domain type.

## Serialization

```ts
import { safeStringify } from '@ntnyq/utils'

const value: Record<string, unknown> = { count: 1n }
value.self = value
safeStringify(value) // '{"count":"1n","self":"[Circular]"}'
```

`safeStringify(value, options)` normalizes bigint, Error objects, and circular
references. Options include `bigintSerializer`, `errorSerializer`,
`circularValue`, `replacer`, and `space`. `fallback` may be a string or
error-aware callback and is used for serialization failures or unrepresentable
top-level values. These normalized strings are useful for logging; do not
assume they deserialize back to the original object types.
