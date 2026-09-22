# Predicate

Source: `docs/api/predicate.md`, `src/predicate/`, `tests/predicate.test.ts`.

## Choose the Guard

| Concern                 | Exports                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Nullish                 | `isUndefined`, `isNull`, `isNil`, `isNullOrUndefined` (alias of `isNil`)                                                 |
| Text                    | `isString`, `isEmptyString`, `isNonEmptyString`, `isWhitespaceString`, `isEmptyStringOrWhitespace`, `isNumericString`    |
| Numbers and primitives  | `isNumber`, `isZero`, `isNaN`, `isInteger`, `isBigInt`, `isSymbol`, `isBoolean`, `isPrimitive`, `isTruthy`, `isFunction` |
| Arrays                  | `isArray`, `isEmptyArray`, `isNonEmptyArray`                                                                             |
| Maps                    | `isMap`, `isEmptyMap`, `isNonEmptyMap`, `isWeakMap`                                                                      |
| Sets                    | `isSet`, `isEmptySet`, `isNonEmptySet`, `isWeakSet`                                                                      |
| Objects                 | `isObject`, `isEmptyObject`, `isNonEmptyObject`, `isRecord`                                                              |
| Built-ins               | `isRegExp`, `isDate`, `isError`, `isIterable`, `isBlob`, `isFormData`, `isFile`                                          |
| Emptiness               | `isAllEmpty`                                                                                                             |
| Promises                | `isNativePromise`, `isPromise`                                                                                           |
| Identifiers             | `isNanoID`, `isUUID`, `isURLString`                                                                                      |
| Inspection and equality | `getObjectTag`, `isDeepEqual`                                                                                            |

## Avoid Overinterpreting a Check

- `isNumber` is a `typeof` check, so it accepts `NaN` and infinities. Use
  `Number.isFinite` when a finite value is required.
- `isWhitespaceString('')` is true. `isNonEmptyString(' ')` is also true.
  `isNumericString` rejects blank strings but follows `Number` conversion,
  including values such as `'Infinity'`.
- `isObject` accepts functions. `isRecord` excludes arrays but still accepts
  functions and built-ins; use `isPlainObject` for plain data objects.
- `isEmptyObject` uses own enumerable string keys and excludes Map/Set.
  It does not establish that an object is plain and ignores symbol-only keys.
- `isAllEmpty` combines nullish, empty text/array/object/Map/Set checks.
  It is not recursive; `0`, `false`, and whitespace strings are not empty.
- `isPromise` accepts native promises or values with callable `then` and
  `catch`. A value with only `then` does not pass this structural check.
- `isDate` identifies a Date object without checking timestamp validity.
- `isNanoID` checks the standard 21-character URL-friendly shape. `isUUID`
  checks versions 1–8 and their variant bits; neither generates identifiers.
- `isURLString` uses `new URL(value)` without a base, so relative paths fail.
  It accepts protocols beyond HTTP; apply protocol constraints separately.

```ts
import { isRecord, isString, safeParse } from '@ntnyq/utils'

const parsed = safeParse('{"name":"Alice"}')
if (parsed.success && isRecord(parsed.value) && isString(parsed.value.name)) {
  console.log(parsed.value.name.toUpperCase())
}
```

## Deep Equality

`isDeepEqual` checks prototypes, own descriptors, symbols, supported built-ins,
and cyclic graph relationships. Map and Set content matching is independent of
insertion order. Accessors are compared without invoking getters. Opaque
built-ins such as promises and weak collections must be the same instance.
Primitive comparison follows `Object.is`, so `NaN` equals itself and positive
and negative zero differ. Use `isArrayEqual` only for ordered shallow arrays.
