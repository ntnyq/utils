---
title: Object Utilities
outline: deep
---

# Object Utilities

Utilities for cloning, sorting, picking, omitting, and cleaning object values.

This section documents 17 exported methods from the object module.

## Methods

- [cleanObject](#cleanobject)
- [cleanObjectInPlace](#cleanobjectinplace)
- [cloneDeep](#clonedeep)
- [deepMerge](#deepmerge)
- [deepMergeWithOptions](#deepmergewithoptions)
- [deleteIn](#deletein)
- [getIn](#getin)
- [hasOwn](#hasown)
- [isKeyOf](#iskeyof)
- [isPlainObject](#isplainobject)
- [mapValues](#mapvalues)
- [omit](#omit)
- [omitInPlace](#omitinplace)
- [pick](#pick)
- [setIn](#setin)
- [sortObjectKeys](#sortobjectkeys)

---

## cleanObject

Creates a deeply cloned object without the selected empty values. Empty-object
cleaning is limited to plain objects without own keys, and recursive cleaning
safely preserves circular references.
Accessors are preserved without being invoked. Functions and opaque built-ins
retained by identity are not recursively cleaned, keeping source data unchanged.

### Parameters

- **obj**: object to be cleaned
- **options**: clean options

### Returns

a cleaned deep clone; the source object is unchanged. Because configured values
may be removed recursively, the result type exposes object properties as
optional.

### Example

```ts
import { cleanObject } from '@ntnyq/utils'

const result = cleanObject({
  name: 'Alice',
  age: undefined,
  meta: { active: true, note: null },
})

console.log(result) // => { name: 'Alice', meta: { active: true } }
```

---

## cleanObjectInPlace

Cleans selected empty values from an object in place.
Accessor properties are preserved without invoking their getters.

```ts
import { cleanObjectInPlace } from '@ntnyq/utils'

const value = { name: 'Alice', note: null }
cleanObjectInPlace(value)
console.log(value) // => { name: 'Alice' }
```

---

## cloneDeep

Deeply clones a value while preserving supported collections, ArrayBuffer and
SharedArrayBuffer data, property descriptors, prototypes, symbol keys, and
circular references. Own metadata attached to supported built-ins is cloned
with its descriptors.
Opaque built-ins without supported cloning behavior, such as `URL`, boxed
primitives, promises, and weak collections, are retained by identity.

### Parameters

- **value**: The value to be cloned.
- **hash**: A WeakMap to track already cloned objects and handle circular references.

### Returns

A deep clone of the input value.

### Example

```ts
import { cloneDeep } from '@ntnyq/utils'

const original = { user: { name: 'Alice' } }
const cloned = cloneDeep(original)
console.log(cloned.user === original.user) // => false
```

---

## deepMerge

Deeply merges objects into a new object.
When a shared source is merged into distinct existing destinations, each
destination keeps its own fields and resolves source cycles to itself.
Shared values copied without an existing destination remain shared.

### Parameters

- **objects**: Source objects from left to right.

### Returns

A new merged object.

### Example

```ts
import { deepMerge } from '@ntnyq/utils'

const result = deepMerge(
  { theme: { color: 'blue', tags: ['base'] } },
  { theme: { color: 'red', tags: ['brand'] } },
)

console.log(result.theme) // => { color: 'red', tags: ['brand'] }
```

---

## deepMergeWithOptions

Deeply merges objects with explicit merge options. Keeping options in a separate
function means an ordinary data object containing `arrayStrategy` is never
misinterpreted as configuration. The inferred result distinguishes replacement
arrays from concatenated arrays, and shared or circular references remain
connected to the final merged graph.
Shared arrays concatenated into distinct destinations are merged independently.
An already-shared destination is merged once per source operand.

### Parameters

- **options**: Merge options such as `arrayStrategy: 'replace' | 'concat'`.
- **objects**: Source objects from left to right.

### Example

```ts
import { deepMergeWithOptions } from '@ntnyq/utils'

const result = deepMergeWithOptions(
  { arrayStrategy: 'concat' },
  { tags: ['base'] },
  { tags: ['feature'] },
)
console.log(result.tags) // => ['base', 'feature']
```

---

## deleteIn

Deletes a nested own property by a dot path or path segments. The default
immutable mode clones only containers along the path; `{ mutate: true }`
updates and returns the source object. Missing paths return the original object.

Deleting an array index preserves its length and leaves an empty slot, matching
JavaScript property deletion semantics.

```ts
import { deleteIn } from '@ntnyq/utils'

const source = { user: { name: 'Alice', role: 'admin' } }
const result = deleteIn(source, 'user.role')

console.log(result) // => { user: { name: 'Alice' } }
console.log(source) // => { user: { name: 'Alice', role: 'admin' } }
```

---

## getIn

Safely gets a nested value by path.

### Parameters

- **target**: Source object.
- **path**: Dot-path string or path segments.
- **options**: Optional settings such as `defaultValue` and custom `separator`.

### Returns

Nested value or default value when not found.

### Example

```ts
import { getIn } from '@ntnyq/utils'

const result = getIn({ user: { profile: { name: 'A' } } }, 'user.profile.name')
console.log(result) // => 'A'
```

---

## hasOwn

Checks whether a non-nullish value has an own property with the given key.

### Parameters

- **object**: the object to check
- **key**: the key to check

### Returns

True for an own property, or false for nullish values and missing keys.

### Example

```ts
import { hasOwn } from '@ntnyq/utils'

const result = hasOwn({ a: 1 }, 'a')
console.log(result) // => true
```

---

## isKeyOf

Type guard for any key, `k` marks `k` as a key of `T` if `k` is a key of `T`

### Parameters

- **obj**: object to query for key
- **k**: key to check for

### Returns

true if `k` is a key of `T`

### Example

```ts
import { isKeyOf } from '@ntnyq/utils'

const object = { a: 1, b: 2 }
const key = 'a' as string

if (isKeyOf(object, key)) {
  console.log(object[key]) // => 1
}
```

---

## isPlainObject

Checks whether a value is a plain object rather than a built-in or custom class instance.

### Parameters

- **value**: The value to check.

### Returns

True if the value is a plain object.

### Example

```ts
import { isPlainObject } from '@ntnyq/utils'

const result = isPlainObject({ a: 1 })
console.log(result) // => true
```

---

## mapValues

Maps an object's own enumerable values into a new object while retaining its
string and symbol key types. The mapper receives the value, key, and original
object; inherited and non-enumerable properties are ignored.

```ts
import { mapValues } from '@ntnyq/utils'

const result = mapValues({ first: 1, second: 2 }, value => value * 2)
console.log(result) // => { first: 2, second: 4 }
```

---

## omit

Creates a new object without the selected keys. Properties with undefined
values can also be omitted.

### Parameters

- **object**: The source object.
- **keys**: An array of keys to omit.
- **options**: Optional `omitUndefined` behavior.

### Returns

A new object without the selected keys.

### Example

```ts
import { omit } from '@ntnyq/utils'

const original = { a: 1, b: 2, c: 3 }
const result = omit(original, ['b'])
console.log(result) // => { a: 1, c: 3 }
console.log(original) // => { a: 1, b: 2, c: 3 }
```

---

## omitInPlace

Removes selected keys from an object in place.

```ts
import { omitInPlace } from '@ntnyq/utils'

const value = { a: 1, b: 2, c: 3 }
omitInPlace(value, 'b')
console.log(value) // => { a: 1, c: 3 }
```

---

## pick

Creates an object composed of the picked object properties.

### Parameters

- **object**: The source object.
- **keys**: The property keys to pick.
- **options**: Optional settings for picking properties.

### Returns

An object composed of the picked properties.

### Example

```ts
const object = { a: 1, b: '2', c: 3 }
const result = pick(object, ['a', 'c'])
console.log(result) // => { a: 1, c: 3 }
```

---

## setIn

Sets a nested value by path.

### Parameters

- **target**: Source object.
- **path**: Dot-path string or path segments.
- **value**: Value to set.
- **options**: Optional settings (`separator`, `createIntermediate`, `mutate`).

### Returns

Updated object. Literal dot paths, custom-separator paths, and tuple paths
produce an updated result type; dynamic paths return a conservative object type.

### Example

```ts
import { setIn } from '@ntnyq/utils'

const result = setIn({ user: {} }, 'user.profile.name', 'Alice')
console.log(result.user.profile.name) // => 'Alice'
```

---

## sortObjectKeys

Sorts an object's keys and optionally sorts nested plain objects recursively.
Deep sorting preserves circular and shared references.

### Parameters

- **object**: The object to sort.
- **options**: Sorting options such as recursion and a custom compare function.

### Returns

A new object with keys sorted according to the provided options.

### Example

```ts
import { sortObjectKeys } from '@ntnyq/utils'

const result = sortObjectKeys({ c: 3, a: 1, b: 2 })
console.log(Object.keys(result)) // => ['a', 'b', 'c']
```
