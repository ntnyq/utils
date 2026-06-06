---
title: Array Utilities
outline: deep
---

# Array Utilities

Helpers for chunking, grouping, normalizing, comparing, and transforming arrays.

This section documents 15 exported methods from the array module.

## Methods

- [at](#at)
- [chunk](#chunk)
- [filterFalsy](#filterfalsy)
- [flattenArrayable](#flattenarrayable)
- [groupBy](#groupby)
- [intersect](#intersect)
- [isArrayEqual](#isarrayequal)
- [last](#last)
- [mergeArrayable](#mergearrayable)
- [partition](#partition)
- [remove](#remove)
- [shuffle](#shuffle)
- [toArray](#toarray)
- [unique](#unique)
- [uniqueBy](#uniqueby)

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

## remove

Remove given item from an array

### Parameters

- **array**: given array
- **value**: item to be removed

### Returns

true if item was removed, otherwise false

### Example

```ts
import { remove } from '@ntnyq/utils'

const list = [1, 2, 3]
remove(list, 2)
console.log(list) // => [1, 3]
```

---

## shuffle

Fisher–Yates shuffle

### Parameters

- **array**: array to shuffle

### Returns

shuffled array

### Example

```ts
import { shuffle } from '@ntnyq/utils'

const result = shuffle([1, 2, 3, 4])
console.log(result) // => shuffled array
```

---

## toArray

Converts a value to an array.

### Parameters

- **array**: The value to convert.

### Returns

The array.

### Example

```ts
import { toArray } from '@ntnyq/utils'

const result = toArray('hello')
console.log(result) // => ['hello']
```

---

## unique

Returns a new array with unique values.

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
- **equalFn**: The function to compare values.

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
