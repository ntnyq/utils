# Array

Source: `docs/api/array.md`, `src/array/`, `tests/array.test.ts`.

## Select the Operation

| Need                                | API                                        | Contract                                                                        |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Normalize optional input            | `toArray(value)`                           | Nullish becomes `[]`; existing arrays retain their reference and readonly type  |
| Flatten one level                   | `flattenArrayable(value)`                  | Normalizes then applies one level of flattening                                 |
| Combine optional scalars and arrays | `mergeArrayable(...values)`                | Skips nullish arguments                                                         |
| Read by index                       | `at(array, index)`, `last(array)`          | Negative indexes supported by `at`; missing items return `undefined`            |
| Batch                               | `chunk(array, size)`                       | Size must be a positive integer, otherwise `RangeError`                         |
| Filter truthy items                 | `filterFalsy(array)`                       | Removes zero, false, empty strings, and other falsy values                      |
| Split by predicate                  | `partition(array, predicate)`              | Returns `[matched, unmatched]`                                                  |
| Group or index                      | `groupBy(array, key)`, `keyBy(array, key)` | Key is a property name or selector; `keyBy` keeps the last duplicate            |
| Deduplicate                         | `unique`, `uniqueBy`, `uniqueWith`         | Value identity, selected key, or equality callback respectively                 |
| Exclude by key                      | `differenceBy(source, excluded, selector)` | Keeps source order and non-excluded duplicates; keys use Set equality           |
| Intersect                           | `intersect(a, b)`                          | Filters `a` by membership in `b`; duplicates from `a` remain                    |
| Compare shallowly                   | `isArrayEqual(a, b)`                       | Ordered item comparison with `===`; use `isDeepEqual` for structural comparison |
| Reorder                             | `moveArrayItem(array, from, to)`           | Returns a copy; negative indexes allowed; invalid indexes throw                 |
| Remove first match                  | `removeArrayItem(array, value)`            | Returns a copy; `removeArrayItemInPlace` mutates and returns a boolean          |
| Shuffle                             | `shuffle(array)`                           | Returns a copy; `shuffleInPlace` mutates                                        |

`unique` and `uniqueBy` keep the first occurrence. `groupBy` and `keyBy` use
object property keys: numeric `1` and string `'1'` coincide, while symbols remain
distinct. They handle special keys such as `__proto__` as data properties.

## Stable Sorting

```ts
import { orderBy, uniqueBy } from '@ntnyq/utils'

const rows = [
  { id: 1, team: 'docs', score: 2 },
  { id: 2, team: 'docs', score: 5 },
  { id: 1, team: 'docs', score: 9 },
]
const result = orderBy(
  uniqueBy(rows, row => row.id),
  ['team', 'score'],
  {
    directions: ['asc', 'desc'],
    nulls: 'last',
  },
)
// IDs: [2, 1]; rows is unchanged
```

`orderBy` accepts one or multiple property names/selectors and returns a stable
sorted copy. Directions default to ascending. `null`, `undefined`, `NaN`, and
invalid dates go last regardless of direction unless `nulls: 'first'` is set.
Strings use UTF-16 ordering; pass `collator: new Intl.Collator(...)` for locale
or numeric string ordering. Prefer selectors with a consistent comparable type.
