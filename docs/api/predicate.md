---
title: Predicate Utilities
outline: deep
---

# Predicate Utilities

Runtime checks grouped by primitive, collection, equality, identifier, and promise concerns.

This section documents 50 exported methods across the predicate submodules.

## Methods

- [getObjectTag](#getobjecttag)
- [isAllEmpty](#isallempty)
- [isArray](#isarray)
- [isBigInt](#isbigint)
- [isBlob](#isblob)
- [isBoolean](#isboolean)
- [isDate](#isdate)
- [isDeepEqual](#isdeepequal)
- [isEmptyArray](#isemptyarray)
- [isEmptyMap](#isemptymap)
- [isEmptyObject](#isemptyobject)
- [isEmptySet](#isemptyset)
- [isEmptyString](#isemptystring)
- [isEmptyStringOrWhitespace](#isemptystringorwhitespace)
- [isError](#iserror)
- [isFile](#isfile)
- [isFormData](#isformdata)
- [isFunction](#isfunction)
- [isInteger](#isinteger)
- [isIterable](#isiterable)
- [isMap](#ismap)
- [isNaN](#isnan)
- [isNanoID](#isnanoid)
- [isNativePromise](#isnativepromise)
- [isNil](#isnil)
- [isNonEmptyArray](#isnonemptyarray)
- [isNonEmptyMap](#isnonemptymap)
- [isNonEmptyObject](#isnonemptyobject)
- [isNonEmptySet](#isnonemptyset)
- [isNonEmptyString](#isnonemptystring)
- [isNull](#isnull)
- [isNullOrUndefined](#isnullorundefined)
- [isNumber](#isnumber)
- [isNumericString](#isnumericstring)
- [isObject](#isobject)
- [isPrimitive](#isprimitive)
- [isPromise](#ispromise)
- [isRecord](#isrecord)
- [isRegExp](#isregexp)
- [isSet](#isset)
- [isString](#isstring)
- [isSymbol](#issymbol)
- [isTruthy](#istruthy)
- [isUndefined](#isundefined)
- [isURLString](#isurlstring)
- [isUUID](#isuuid)
- [isWeakMap](#isweakmap)
- [isWeakSet](#isweakset)
- [isWhitespaceString](#iswhitespacestring)
- [isZero](#iszero)

---

## getObjectTag

Gets the `Object.prototype.toString` tag of a value.

### Parameters

- **value**: The value to inspect.

### Returns

The object tag such as String, Array, or Map.

### Example

```ts
import { getObjectTag } from '@ntnyq/utils'

const result = getObjectTag(new Map())
console.log(result) // => 'Map'
```

---

## isAllEmpty

Check if value is empty

### Parameters

- **value**: The value to check

### Returns

True if the value is `null`, `undefined`, empty string, empty array, empty object, empty set, empty map, false otherwise

### Example

```ts
import { isAllEmpty } from '@ntnyq/utils'

const result = isAllEmpty([])
console.log(result) // => true
```

---

## isArray

Checks whether a value is an array.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an array.

### Example

```ts
import { isArray } from '@ntnyq/utils'

const result = isArray([1, 2, 3])
console.log(result) // => true
```

---

## isBigInt

Checks whether a value is a bigint.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a bigint.

### Example

```ts
import { isBigInt } from '@ntnyq/utils'

const result = isBigInt(42n)
console.log(result) // => true
```

---

## isBlob

Checks whether a value is a Blob.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Blob.

### Example

```ts
import { isBlob } from '@ntnyq/utils'

const result = isBlob(new Blob(['hello']))
console.log(result) // => true
```

---

## isBoolean

Checks whether a value is a boolean.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a boolean.

### Example

```ts
import { isBoolean } from '@ntnyq/utils'

const result = isBoolean(false)
console.log(result) // => true
```

---

## isDate

Checks whether a value is a Date.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Date instance.

### Example

```ts
import { isDate } from '@ntnyq/utils'

const result = isDate(new Date())
console.log(result) // => true
```

---

## isDeepEqual

Checks whether two values are deeply equal. Supported collections and buffers
are compared by intrinsic value and attached own properties; opaque built-ins
such as `Promise`, `WeakMap`, and `WeakSet` are equal only by identity.
Shared references and cycles must correspond across both graphs. Map and Set
insertion order does not affect equality, including when other properties
reference their entries.

### Parameters

- **value1**: The first value to compare.
- **value2**: The second value to compare.

### Returns

True if the two values are deeply equal, or false otherwise.

### Example

```ts
import { isDeepEqual } from '@ntnyq/utils'

const result = isDeepEqual({ a: 1 }, { a: 1 })
console.log(result) // => true
```

---

## isEmptyArray

Checks whether a value is an empty array.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an empty array.

### Example

```ts
import { isEmptyArray } from '@ntnyq/utils'

const result = isEmptyArray([])
console.log(result) // => true
```

---

## isEmptyMap

Checks whether a value is an empty Map.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Map with no entries.

### Example

```ts
import { isEmptyMap } from '@ntnyq/utils'

const result = isEmptyMap(new Map())
console.log(result) // => true
```

---

## isEmptyObject

Checks whether a value is an empty plain object.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an object with no own keys.

### Example

```ts
import { isEmptyObject } from '@ntnyq/utils'

const result = isEmptyObject({})
console.log(result) // => true
```

---

## isEmptySet

Checks whether a value is an empty Set.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Set with no entries.

### Example

```ts
import { isEmptySet } from '@ntnyq/utils'

const result = isEmptySet(new Set())
console.log(result) // => true
```

---

## isEmptyString

Checks whether a value is an empty string.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an empty string.

### Example

```ts
import { isEmptyString } from '@ntnyq/utils'

const result = isEmptyString('')
console.log(result) // => true
```

---

## isEmptyStringOrWhitespace

Checks whether a value is an empty string or only whitespace.

### Parameters

- **value**: The value to test.

### Returns

True if the value is empty or contains only whitespace.

### Example

```ts
import { isEmptyStringOrWhitespace } from '@ntnyq/utils'

const result = isEmptyStringOrWhitespace(' ')
console.log(result) // => true
```

---

## isError

Checks whether a value is an Error instance.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an Error.

### Example

```ts
import { isError } from '@ntnyq/utils'

const result = isError(new Error('boom'))
console.log(result) // => true
```

---

## isFile

Checks whether a value is a File.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a File.

### Example

```ts
import { isFile } from '@ntnyq/utils'

const file = new File(['hello'], 'hello.txt')
const result = isFile(file)
console.log(result) // => true
```

---

## isFormData

Checks whether a value is a FormData instance.

### Parameters

- **value**: The value to test.

### Returns

True if the value is FormData.

### Example

```ts
import { isFormData } from '@ntnyq/utils'

const result = isFormData(new FormData())
console.log(result) // => true
```

---

## isFunction

Checks whether a value is a function.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a function.

### Example

```ts
import { isFunction } from '@ntnyq/utils'

const result = isFunction(() => {})
console.log(result) // => true
```

---

## isInteger

Checks whether a value is an integer.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an integer.

### Example

```ts
import { isInteger } from '@ntnyq/utils'

const result = isInteger(42)
console.log(result) // => true
```

---

## isIterable

Checks whether a value is iterable.

### Parameters

- **value**: The value to test.

### Returns

True if the value implements Symbol.iterator.

### Example

```ts
import { isIterable } from '@ntnyq/utils'

const result = isIterable(new Set([1, 2, 3]))
console.log(result) // => true
```

---

## isMap

Checks whether a value is a Map.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Map instance.

### Example

```ts
import { isMap } from '@ntnyq/utils'

const result = isMap(new Map())
console.log(result) // => true
```

---

## isNaN

Checks whether a value is NaN.

### Parameters

- **value**: The value to test.

### Returns

True if the value is NaN.

### Example

```ts
import { isNaN } from '@ntnyq/utils'

const result = isNaN(Number.NaN)
console.log(result) // => true
```

---

## isNanoID

Check if the value is a NanoID string.

### Parameters

- **value**: The value to check.

### Returns

true if the value is a NanoID string, otherwise false.

### Example

```ts
import { isNanoID } from '@ntnyq/utils'

const result = isNanoID('V1StGXR8_Z5jdHi6B-myT')
console.log(result) // => true
```

---

## isNativePromise

Checks whether a value is a native Promise instance.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a native Promise.

### Example

```ts
import { isNativePromise } from '@ntnyq/utils'

const result = isNativePromise(Promise.resolve(1))
console.log(result) // => true
```

---

## isNil

Checks whether a value is null or undefined.

### Parameters

- **value**: The value to test.

### Returns

True if the value is null or undefined.

### Example

```ts
import { isNil } from '@ntnyq/utils'

const result = isNil(undefined)
console.log(result) // => true
```

---

## isNonEmptyArray

Checks whether a value is a non-empty array.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an array containing at least one item.

### Example

```ts
import { isNonEmptyArray } from '@ntnyq/utils'

const result = isNonEmptyArray([1, 2, 3])
console.log(result) // => true
```

---

## isNonEmptyMap

Checks whether a value is a non-empty Map.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Map containing at least one entry.

### Example

```ts
import { isNonEmptyMap } from '@ntnyq/utils'

const result = isNonEmptyMap(new Map([['key', 'value']]))
console.log(result) // => true
```

---

## isNonEmptyObject

Checks whether a value is an object with at least one own enumerable key.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an object with one or more own enumerable keys.

### Example

```ts
import { isNonEmptyObject } from '@ntnyq/utils'

const result = isNonEmptyObject({ key: 'value' })
console.log(result) // => true
```

---

## isNonEmptySet

Checks whether a value is a non-empty Set.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Set containing at least one entry.

### Example

```ts
import { isNonEmptySet } from '@ntnyq/utils'

const result = isNonEmptySet(new Set([1]))
console.log(result) // => true
```

---

## isNonEmptyString

Checks whether a value is a non-empty string.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a string with at least one character.

### Example

```ts
import { isNonEmptyString } from '@ntnyq/utils'

const result = isNonEmptyString('hello')
console.log(result) // => true
```

---

## isNull

Checks whether a value is null.

### Parameters

- **value**: The value to test.

### Returns

True if the value is null.

### Example

```ts
import { isNull } from '@ntnyq/utils'

const result = isNull(null)
console.log(result) // => true
```

---

## isNullOrUndefined

Checks whether a value is either `null` or `undefined` and narrows its type.

### Example

```ts
import { isNullOrUndefined } from '@ntnyq/utils'

console.log(isNullOrUndefined(undefined)) // => true
console.log(isNullOrUndefined(0)) // => false
```

---

## isNumber

Checks whether a value is a number.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a number.

### Example

```ts
import { isNumber } from '@ntnyq/utils'

const result = isNumber(42)
console.log(result) // => true
```

---

## isNumericString

Checks whether a value is a numeric string.

### Parameters

- **value**: The value to test.

### Returns

True if the value can be parsed as a number.

### Example

```ts
import { isNumericString } from '@ntnyq/utils'

const result = isNumericString('123.45')
console.log(result) // => true
```

---

## isObject

Checks whether a value is an object or function-like object.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a non-null object.

### Example

```ts
import { isObject } from '@ntnyq/utils'

const result = isObject({ foo: 'bar' })
console.log(result) // => true
```

---

## isPrimitive

Checks whether a value is a JavaScript primitive.

### Parameters

- **value**: The value to test.

### Returns

True if the value is `null`, `undefined`, a string, number, boolean, symbol, or bigint.

### Example

```ts
import { isPrimitive } from '@ntnyq/utils'

const result = isPrimitive('hello')
console.log(result) // => true
```

---

## isPromise

Checks whether a value behaves like a Promise.

### Parameters

- **value**: The value to test.

### Returns

True if the value is promise-like.

### Example

```ts
import { isPromise } from '@ntnyq/utils'

const result = isPromise(Promise.resolve(1))
console.log(result) // => true
```

---

## isRecord

Checks whether a value is a record-like object.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a non-array object.

### Example

```ts
import { isRecord } from '@ntnyq/utils'

const result = isRecord({ foo: 'bar' })
console.log(result) // => true
```

---

## isRegExp

Checks whether a value is a regular expression.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a RegExp instance.

### Example

```ts
import { isRegExp } from '@ntnyq/utils'

const result = isRegExp(/abc/)
console.log(result) // => true
```

---

## isSet

Checks whether a value is a Set.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a Set instance.

### Example

```ts
import { isSet } from '@ntnyq/utils'

const result = isSet(new Set([1]))
console.log(result) // => true
```

---

## isString

Checks whether a value is a string.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a string.

### Example

```ts
import { isString } from '@ntnyq/utils'

const result = isString('hello')
console.log(result) // => true
```

---

## isSymbol

Checks whether a value is a symbol.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a symbol.

### Example

```ts
import { isSymbol } from '@ntnyq/utils'

const result = isSymbol(Symbol('example'))
console.log(result) // => true
```

---

## isTruthy

Checks whether a value is truthy.

### Parameters

- **value**: The value to test.

### Returns

True if the value is truthy.

### Example

```ts
import { isTruthy } from '@ntnyq/utils'

const result = isTruthy('hello')
console.log(result) // => true
```

---

## isUndefined

Checks whether a value is undefined.

### Parameters

- **value**: The value to test.

### Returns

True if the value is undefined.

### Example

```ts
import { isUndefined } from '@ntnyq/utils'

const result = isUndefined(undefined)
console.log(result) // => true
```

---

## isURLString

Checks whether a value is a valid URL string.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a valid absolute URL string.

### Example

```ts
import { isURLString } from '@ntnyq/utils'

const result = isURLString('https://example.com')
console.log(result) // => true
```

---

## isUUID

Check if the value is a UUID string. This function validates UUID strings of versions 1 to 8, ensuring they follow the standard format.

### Parameters

- **value**: The value to check.

### Returns

true if the value is a UUID string, otherwise false.

### Example

```ts
import { isUUID } from '@ntnyq/utils'

const result = isUUID('123e4567-e89b-12d3-a456-426614174000')
console.log(result) // => true
```

---

## isWeakMap

Checks whether a value is a WeakMap.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a WeakMap instance.

### Example

```ts
import { isWeakMap } from '@ntnyq/utils'

const result = isWeakMap(new WeakMap())
console.log(result) // => true
```

---

## isWeakSet

Checks whether a value is a WeakSet.

### Parameters

- **value**: The value to test.

### Returns

True if the value is a WeakSet instance.

### Example

```ts
import { isWeakSet } from '@ntnyq/utils'

const result = isWeakSet(new WeakSet())
console.log(result) // => true
```

---

## isWhitespaceString

Checks whether a value is an empty string or contains only whitespace.

### Parameters

- **value**: The value to test.

### Returns

True if the value is an empty or whitespace-only string. Successful checks
narrow to the branded `Whitespace` string type.

### Example

```ts
import { isWhitespaceString } from '@ntnyq/utils'

const result = isWhitespaceString('   ')
console.log(result) // => true
```

---

## isZero

Checks whether a value is exactly zero.

### Parameters

- **value**: The value to test.

### Returns

True if the value is 0.

### Example

```ts
import { isZero } from '@ntnyq/utils'

const result = isZero(0)
console.log(result) // => true
```
