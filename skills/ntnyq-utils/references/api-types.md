# Types

Source: `docs/api/types.md`, `src/types/`, `tests/types.utils.test.ts`, and
`tests/types*.test.ts` for public API inference.

Import these using `import type { ... } from '@ntnyq/utils'`.

| Type                                                    | Meaning or limitation                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `AnyFn<R, T>`                                           | Function with `T[]` arguments returning `R`                                            |
| `Arrayable<T>`                                          | `T` or mutable `T[]`; readonly arrays are not included in this alias                   |
| `Awaitable<T>`                                          | `T` or `Promise<T>`                                                                    |
| `Callable<T>`                                           | `T` or a function returning `T`                                                        |
| `MayBe<T>`                                              | Adds `undefined`                                                                       |
| `Nullable<T>`                                           | Adds `null`, not `undefined`                                                           |
| `Prettify<T>`                                           | Expands a mapped object type for readability                                           |
| `Primitive`                                             | Library alias includes functions as well as JavaScript primitives                      |
| `PropertyKeyOf<T>`                                      | Keys whose values are assignable to `PropertyKey`                                      |
| `DeepRequired<T>`                                       | Recursively removes optional and nullish values while preserving array/tuple structure |
| `Overwrite<T, U>`                                       | Replaces matching properties and adds new properties from `U`                          |
| `StrictOverwrite<T, U>`                                 | Resolves to `never` if `U` introduces a key outside `T`                                |
| `Without<T, U>`                                         | Marks keys of `T` absent from `U` as optional `never`; not ordinary `Omit`             |
| `Exclusive<T, U>`                                       | Exclusive choice between object shapes                                                 |
| `JsonPrimitive`, `JsonArray`, `JsonObject`, `JsonValue` | JSON data contracts; no bigint or undefined JSON values                                |
| `InteropModuleDefault<T>`                               | Extracts `default` when present in the module type                                     |
| `LiteralUnion<Union, Base>`                             | Keeps literal completion while allowing other base values                              |
| `NonEmptyObject<T>`                                     | Resolves empty record types to `never`; no runtime validation                          |
| `ValueOf<T>`                                            | Union of property value types                                                          |
| `ElementOf<T>`                                          | Extracts mutable-array elements; input constraint also permits nullish values          |

```ts
import type {
  Arrayable,
  DeepRequired,
  Exclusive,
  Overwrite,
} from '@ntnyq/utils'

type Tags = Arrayable<string>
type Config = DeepRequired<{ nested?: { enabled?: boolean | null } }>
type Saved = Overwrite<{ id: number; name: string }, { id: string }>
type Locator = Exclusive<{ id: string }, { slug: string }>
```

The `Primitive` alias differs from the runtime `isPrimitive` predicate, which
excludes functions. Type helpers do not validate values at runtime.

Options and result types are exported alongside their corresponding utility,
through the same flat package entry. Examples include `MapAsyncOptions`,
`RetryOptions`, `ObjectOmitOptions`, `SetInResult`, `FileValidationIssue`,
`StorageUnit`, and `TimeUnit`. Consult that utility's declarations for generics
instead of recreating its contract locally.
