# Object

Source: `docs/api/object.md`, `src/object/`, `tests/object.test.ts`, and
`tests/types.api.test.ts`.

## Selection and Mapping

- `pick(object, keys, { omitUndefined })` selects own properties into a new
  object. `omitUndefined` defaults to false.
- `omit(object, keys, { omitUndefined })` returns a new object, preserving its
  prototype and retained property descriptors, including symbols.
- `omitInPlace(object, ...keys)` deletes properties from the source. Its keys
  are rest arguments, unlike `omit`.
- `mapValues(object, (value, key, source) => result)` maps own enumerable string
  and symbol properties into a new object.
- `hasOwn(object, key)` tolerates nullish inputs; `isKeyOf(object, key)` narrows
  the key type. `isPlainObject(value)` excludes custom class instances.
- `sortObjectKeys(object, options)` creates a sorted object; recursive sorting
  preserves shared and circular references.

## Cleaning and Cloning

```ts
import { cleanObject } from '@ntnyq/utils'

const payload = cleanObject(
  { name: 'Alice', note: '', score: 0, meta: { unused: null } },
  { cleanEmptyString: true, cleanEmptyObject: true },
)
// { name: 'Alice', score: 0 }
```

`cleanObject` makes a deep clone; `cleanObjectInPlace` cleans the source.
Defaults remove `undefined`, `null`, and `NaN`, and recursively clean nested
records. Zero, empty strings, empty arrays, and empty plain objects require
their corresponding `clean*` options. Array contents are not recursively
cleaned. Result properties are optional because cleaning can remove them.
Accessors are preserved without invoking getters; circular references survive.

`cloneDeep(value)` preserves supported collections, buffers, descriptors,
prototypes, symbols, and cycles. Functions and opaque built-ins such as promises,
weak collections, boxed primitives, and URL objects retain identity. Do not
assume every reachable value becomes an independent object.

## Merging

`deepMerge(...objects)` creates a new merged graph, with later values winning
and arrays replaced. Configure concatenation with a separate function:

```ts
import { deepMergeWithOptions } from '@ntnyq/utils'

const config = deepMergeWithOptions(
  { arrayStrategy: 'concat' },
  { tags: ['base'] },
  { tags: ['feature'] },
)
// { tags: ['base', 'feature'] }
```

Do not pass merge options as an operand to `deepMerge`; that is ordinary data.
Shared and circular source references are supported.

## Nested Paths

```ts
import { deleteIn, getIn, setIn } from '@ntnyq/utils'

const source = { user: { name: 'Alice', role: 'admin' } }
const name = getIn(source, ['user', 'name'] as const) // string | undefined
const updated = setIn(source, 'user.name', 'Bob')
const publicValue = deleteIn(updated, 'user.role')
// source remains unchanged
```

- Paths accept dot strings or arrays of string, number, and symbol segments.
  Use segment arrays for keys containing dots and for `getIn` type inference.
  String paths do not implement bracket-expression syntax.
- `getIn` accepts `{ defaultValue, separator }`. It reads properties, including
  inherited ones; it is not an own-property validator. String-path results are
  conservatively typed as `unknown`.
- `setIn` defaults to `{ mutate: false, createIntermediate: true }`. Numeric
  next segments create arrays. Literal paths produce updated result types;
  dynamic paths produce a conservative object type.
- `deleteIn` deletes own properties and clones containers along the path by
  default. Missing paths return the original object. Deleting an array index
  leaves a hole without shortening the array.
- Both write helpers accept `{ mutate: true }` and reject unsafe path segments
  such as `__proto__`, `constructor`, and `prototype`.
