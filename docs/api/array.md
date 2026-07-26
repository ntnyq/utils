---
title: Array Utilities
outline: deep
---

# Array Utilities

Helpers for chunking, grouping, normalizing, comparing, and transforming arrays.

This section documents 23 exported methods from the array module.

## Methods

- [at](#at)
- [chunk](#chunk)
- [differenceBy](#differenceby)
- [filterFalsy](#filterfalsy)
- [flattenArrayable](#flattenarrayable)
- [groupBy](#groupby)
- [intersect](#intersect)
- [isArrayEqual](#isarrayequal)
- [keyBy](#keyby)
- [last](#last)
- [mergeArrayable](#mergearrayable)
- [orderBy](#orderby)
- [moveArrayItem](#movearrayitem)
- [partition](#partition)
- [removeArrayItem](#removearrayitem)
- [removeArrayItemInPlace](#removearrayiteminplace)
- [remove](#remove-deprecated)
- [shuffle](#shuffle)
- [shuffleInPlace](#shuffleinplace)
- [toArray](#toarray)
- [unique](#unique)
- [uniqueBy](#uniqueby)
- [uniqueWith](#uniquewith)

---

## at

Get array item by index, negative for backward

### Parameters

- **array**: given array
- **index**: index of item

### Returns

undefined if not match, otherwise matched item

### Example

```ts
import { at } from '@ntnyq/utils'

const result = at(['a', 'b', 'c'], -1)
console.log(result) // => 'c'
```

---

## chunk

Splits an array into smaller chunks of a given size.

### Parameters

- **array**: The array to split
- **size**: The size of each chunk

### Returns

An array of arrays, where each sub-array has `size` elements from the original array.

### Example

```ts
import { chunk } from '@ntnyq/utils'

const result = chunk([1, 2, 3, 4], 2)
console.log(result) // => [[1, 2], [3, 4]]
```

---

## differenceBy

Returns source items whose selected keys do not appear in the excluded array.
It preserves source order and non-excluded duplicates, and compares keys with
`Set` SameValueZero semantics.

```ts
import { differenceBy } from '@ntnyq/utils'

const result = differenceBy(
  [{ id: 1 }, { id: 2 }, { id: 3 }],
  [{ id: 2 }],
  item => item.id,
)

console.log(result) // => [{ id: 1 }, { id: 3 }]
```

---

## filterFalsy

Filters out falsy values from an array.

### Parameters

- **array**: The array to filter.

### Returns

A new array containing only truthy values from the original array.

### Example

```ts
const mixedArray = [0, 1, false, 2, '', 3, null, 4, undefined, 5]
const truthyArray = filterFalsy(mixedArray)
console.log(truthyArray) // Output: [1, 2, 3, 4, 5]
```

---

## flattenArrayable

Convert `Arrayable&lt;T&gt;` to `Array&lt;T&gt;` and flatten the result

### Parameters

- **array**: given array

### Returns

Array&lt;T&gt;

### Example

```ts
import { flattenArrayable } from '@ntnyq/utils'

const result = flattenArrayable([1, [2, 3], 4])
console.log(result) // => [1, 2, 3, 4]
```

---

## groupBy

Groups the elements of an array based on a specified key or a function that returns a key.

### Parameters

- **array**: The array to be grouped.
- **key**: A string representing the property name to group by, or a function that takes an item and returns a string key.

### Returns

An object where the keys are the group identifiers and the values are arrays of items that belong to each group.

### Example

```ts
const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 30 },
]
const groupedByAge = groupBy(data, 'age')

console.log(groupedByAge)
// Output:
// {
//   '25': [{ name: 'Bob', age: 25 }],
//   '30': [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }],
// }

const groupedByNameLength = groupBy(data, item => item.name.length)

console.log(groupedByNameLength)
// Output:
// {
//   '3': [{ name: 'Bob', age: 25 }],
//   '5': [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }],
// }
```

---

## keyBy

Indexes items by a property key or selector. If a key occurs more than once,
the last item wins. String, number, and symbol keys are supported safely.

```ts
import { keyBy } from '@ntnyq/utils'

const users = [
  { id: 'a', name: 'Alice' },
  { id: 'b', name: 'Bob' },
]

const usersById = keyBy(users, 'id')
console.log(usersById.a?.name) // => 'Alice'
```

---

## intersect

Gets the intersection of two arrays.

### Parameters

- **a**: The first array.
- **b**: The second array.

### Returns

A new array containing items present in both arrays.

### Example

```ts
import { intersect } from '@ntnyq/utils'

const result = intersect([1, 2, 3], [2, 3, 4])
console.log(result) // => [2, 3]
```

---

## isArrayEqual

Check if values of two arrays are equal

### Parameters

- **array1**: array 1
- **array2**: array 2

### Returns

`true` if equal

### Example

```ts
import { isArrayEqual } from '@ntnyq/utils'

const result = isArrayEqual([1, 2], [1, 2])
console.log(result) // => true
```

---

## last

Get the last item of given array

### Parameters

- **array**: given array

### Returns

undefined if empty array, otherwise last item

### Example

```ts
import { last } from '@ntnyq/utils'

const result = last([1, 2, 3])
console.log(result) // => 3
```

---

## mergeArrayable

Use rest arguments to merge arrays

### Parameters

- **args**: rest arguments

### Returns

Array&lt;T&gt;

### Example

```ts
import { mergeArrayable } from '@ntnyq/utils'

const result = mergeArrayable(1, [2, 3], null, 4)
console.log(result) // => [1, 2, 3, 4]
```

---

## orderBy

Returns a stable, non-mutating sort by one or more property keys or selectors.
Directions default to ascending. `null`, `undefined`, `NaN`, and invalid dates
default to the end regardless of direction; set `nulls: 'first'` to reverse
their position.

Strings use JavaScript UTF-16 lexicographic order by default. Pass an
`Intl.Collator` for locale-aware comparison. Selectors should return a
consistent comparable type; mixed comparable types use the fixed order
boolean, bigint, number, Date, then string.

```ts
import { orderBy } from '@ntnyq/utils'

const rows = [
  { team: 'b', score: 1 },
  { team: 'a', score: 2 },
  { team: 'a', score: 1 },
]

const result = orderBy(rows, ['team', 'score'], {
  directions: ['asc', 'desc'],
  nulls: 'last',
  collator: new Intl.Collator('en', { numeric: true }),
})
```

---

## moveArrayItem

Moves an item to another index in a copied array. Negative indexes count from
the end, and invalid or out-of-bounds indexes throw a `RangeError`.

```ts
import { moveArrayItem } from '@ntnyq/utils'

const source = ['a', 'b', 'c']
const result = moveArrayItem(source, 0, -1)

console.log(result) // => ['b', 'c', 'a']
console.log(source) // => ['a', 'b', 'c']
```

---

## partition

Splits an array into two groups in one pass.

### Parameters

- **array**: Source array.
- **predicate**: Partition predicate.

### Returns

A tuple of `[matched, unmatched]` arrays.

### Example

```ts
import { partition } from '@ntnyq/utils'

const [even, odd] = partition([1, 2, 3, 4], n => n % 2 === 0)
console.log(even, odd) // => [2, 4] [1, 3]
```

---

## removeArrayItem

Returns a new array without the first matching item.

### Parameters

- **array**: The source array.
- **value**: The item to remove.

### Returns

A new array without the first matching item. The source array is unchanged.

### Example

```ts
import { removeArrayItem } from '@ntnyq/utils'

const list = [1, 2, 3]
const result = removeArrayItem(list, 2)
console.log(result) // => [1, 3]
console.log(list) // => [1, 2, 3]
```

---

## removeArrayItemInPlace

Removes the first matching item from an array in place and reports whether an
item was removed.

```ts
import { removeArrayItemInPlace } from '@ntnyq/utils'

const list = [1, 2, 3]
const removed = removeArrayItemInPlace(list, 2)
console.log(removed, list) // => true, [1, 3]
```

---

## remove (deprecated)

Deprecated compatibility name for `removeArrayItemInPlace`.

---

## shuffle

Returns a Fisher–Yates shuffled copy.

### Parameters

- **array**: array to copy and shuffle

### Returns

a shuffled copy; the source array is unchanged

### Example

```ts
import { shuffle } from '@ntnyq/utils'

const result = shuffle([1, 2, 3, 4])
console.log(result) // => shuffled array
```

---

## shuffleInPlace

Applies a Fisher–Yates shuffle to an array in place.

```ts
import { shuffleInPlace } from '@ntnyq/utils'

const values = [1, 2, 3, 4]
shuffleInPlace(values)
```

---

## toArray

Converts a value to an array. Existing mutable and readonly arrays are returned
by reference with their input type preserved. Nullish values become an empty
array, while other values are wrapped in a new mutable array.

### Parameters

- **array**: The value to convert.

### Returns

The array.

### Example

```ts
import { toArray } from '@ntnyq/utils'

const result = toArray('hello')
console.log(result) // => ['hello']

const values = [1, 2] as const
const preserved = toArray(values) // readonly [1, 2]
```

---

## unique

Returns a new array with unique values selected by key.

### Parameters

- **array**: The array to process.

### Returns

The new array.

### Example

```ts
import { unique } from '@ntnyq/utils'

const result = unique([1, 1, 2, 3, 3])
console.log(result) // => [1, 2, 3]
```

---

## uniqueBy

Returns a new array with unique values.

### Parameters

- **array**: The array to process.
- **selector**: Resolves the uniqueness key for each item.

### Returns

The new array.

### Example

```ts
import { uniqueBy } from '@ntnyq/utils'

const result = uniqueBy(
  [
    { id: 1, name: 'Alice' },
    { id: 1, name: 'Alice 2' },
    { id: 2, name: 'Bob' },
  ],
  item => item.id,
)
console.log(result.length) // => 2
```

---

## uniqueWith

Returns a new array with unique values using a custom equality function.

### Parameters

- **array**: The array to process.
- **equals**: Returns true when two values should be treated as equal.

### Example

```ts
import { uniqueWith } from '@ntnyq/utils'

const result = uniqueWith(
  [{ id: 1 }, { id: 1 }, { id: 2 }],
  (left, right) => left.id === right.id,
)
console.log(result.length) // => 2
```
