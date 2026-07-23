---
title: Object Utilities
outline: deep
---

# Object Utilities

Utilities for cloning, sorting, picking, omitting, and cleaning object values.

This section documents 15 exported methods from the object module.

## Methods

- [cleanObject](#cleanobject)
- [cleanObjectInPlace](#cleanobjectinplace)
- [cloneDeep](#clonedeep)
- [deepMerge](#deepmerge)
- [deepMergeWithOptions](#deepmergewithoptions)
- [getIn](#getin)
- [hasOwn](#hasown)
- [isKeyOf](#iskeyof)
- [isPlainObject](#isplainobject)
- [objectOmit](#objectomit)
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

### Parameters

- **obj**: object to be cleaned
- **options**: clean options

### Returns

a cleaned deep clone; the source object is unchanged

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
circular references.

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
misinterpreted as configuration.

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

const result = isKeyOf({ a: 1, b: 2 }, 'a')
console.log(result) // => true
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

## objectOmit

Deprecated compatibility name for `omit`.

### Parameters

- **obj**: The original object from which properties will be omitted.
- **keys**: An array of keys that should be omitted from the resulting object.
- **options**: An optional object that can contain the `omitUndefined` property to specify whether properties with undefined values should also be omitted.

### Returns

A new object that includes all properties from the original object except those specified in the `keys` array and, if `omitUndefined` is true, those with undefined values.

### Example

```ts
const original = { a: 1, b: 2, c: undefined }
const result = objectOmit(original, ['b'], { omitUndefined: true })
console.log(result) // Output: { a: 1 }
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

Updated object.

### Example

```ts
import { setIn } from '@ntnyq/utils'

const result = setIn({ user: {} }, 'user.profile.name', 'Alice')
console.log(result.user.profile.name) // => 'Alice'
```

---

## sortObjectKeys

Sorts an object's keys and optionally sorts nested plain objects recursively.

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
