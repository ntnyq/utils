---
title: Miscellaneous Utilities
outline: deep
---

# Miscellaneous Utilities

General-purpose helpers for math, time, storage, async timing, and warnings.

This section documents 14 exported methods from the misc module.

## Methods

- [cAF](#caf)
- [clamp](#clamp)
- [convertFromBytes](#convertfrombytes)
- [convertFromMilliseconds](#convertfrommilliseconds)
- [convertStorageUnit](#convertstorageunit)
- [convertTimeUnit](#converttimeunit)
- [convertToBytes](#converttobytes)
- [convertToMilliseconds](#converttomilliseconds)
- [debounce](#debounce)
- [getRoot](#getroot)
- [rAF](#raf)
- [throttle](#throttle)
- [waitFor](#waitfor)
- [warnOnce](#warnonce)

---

## cAF

Cancel animation frame

### Parameters

- **id**: id

### Returns

void

### Example

```ts
import { cAF } from '@ntnyq/utils'

const id = requestAnimationFrame(() => {})
cAF(id)
```

---

## clamp

Clamps a number between a minimum and maximum value

### Parameters

- **value**: the value to clamp within the given range
- **min**: the minimum value to clamp
- **max**: the maximum value to clamp

### Returns

the new value

### Example

```ts
import { clamp } from '@ntnyq/utils'

const result = clamp(15, 0, 10)
console.log(result) // => 10
```

---

## convertFromBytes

Converts bytes to specified storage unit.

### Parameters

- **bytes**: The size in bytes.
- **toUnit**: The target unit (default: 'MB').

### Returns

The size in the specified unit.

### Example

```ts
convertFromBytes(5242880, 'MB') // 5
convertFromBytes(1073741824, 'GB') // 1
convertFromBytes(524288, 'KB') // 512
```

---

## convertFromMilliseconds

Converts milliseconds to specified time unit.

### Parameters

- **milliseconds**: The time in milliseconds.
- **toUnit**: The target unit (default: 'SECOND').

### Returns

The time in the specified unit.

### Example

```ts
convertFromMilliseconds(5000, 'SECOND') // 5
convertFromMilliseconds(120000, 'MINUTE') // 2
convertFromMilliseconds(3600000, 'HOUR') // 1
```

---

## convertStorageUnit

Converts between storage units.

### Parameters

- **value**: The size value.
- **fromUnit**: The source unit.
- **toUnit**: The target unit.

### Returns

The converted size.

### Example

```ts
convertStorageUnit(1, 'GB', 'MB') // 1024
convertStorageUnit(2048, 'MB', 'GB') // 2
convertStorageUnit(1024, 'KB', 'MB') // 1
```

---

## convertTimeUnit

Converts between time units.

### Parameters

- **value**: The time value.
- **fromUnit**: The source unit.
- **toUnit**: The target unit.

### Returns

The converted time.

### Example

```ts
convertTimeUnit(1, 'HOUR', 'MINUTE') // 60
convertTimeUnit(120, 'SECOND', 'MINUTE') // 2
convertTimeUnit(2, 'WEEK', 'DAY') // 14
```

---

## convertToBytes

Converts storage units to bytes.

### Parameters

- **value**: The size value.
- **fromUnit**: The source unit (default: 'MB').

### Returns

The size in bytes.

### Example

```ts
convertToBytes(5, 'MB') // 5242880
convertToBytes(1, 'GB') // 1073741824
convertToBytes(512, 'KB') // 524288
```

---

## convertToMilliseconds

Converts time units to milliseconds.

### Parameters

- **value**: The time value.
- **fromUnit**: The source unit (default: 'SECOND').

### Returns

The time in milliseconds.

### Example

```ts
convertToMilliseconds(5, 'SECOND') // 5000
convertToMilliseconds(2, 'MINUTE') // 120000
convertToMilliseconds(1, 'HOUR') // 3600000
```

---

## debounce

Creates a debounced version of a function.

### Parameters

- **delay**: The debounce delay in milliseconds.
- **callback**: The function to debounce.
- **options**: Additional debounce options.

### Returns

A debounced function with a cancel method.

### Example

```ts
import { debounce } from '@ntnyq/utils'

const onSearch = debounce(300, () => console.log('search'))
onSearch()
```

---

## getRoot

Gets the global root object.

### Returns

the global root object

### Example

```ts
import { getRoot } from '@ntnyq/utils'

const root = getRoot()
console.log(root === globalThis) // => true
```

---

## rAF

Request animation frame

### Parameters

- **fn**: callback

### Returns

id

### Example

```ts
import { rAF } from '@ntnyq/utils'

const id = rAF(() => console.log('paint'))
console.log(typeof id) // => 'number'
```

---

## throttle

Throttle a function to limit its execution to a maximum of once per a specified time interval.

### Parameters

- **delay**: Zero or greater delay in milliseconds
- **callback**: A function to be throttled
- **options**: throttle options

### Returns

A throttled function

### Example

```ts
import { throttle } from '@ntnyq/utils'

const onResize = throttle(200, () => console.log('resized'))
onResize()
```

---

## waitFor

Wait for a number of milliseconds

### Parameters

- **ms**: millseconds to wait

### Returns

a promise that resolves after ms milliseconds

### Example

```ts
import { waitFor } from '@ntnyq/utils'
await waitFor(3e3)
// do somthing after 3 seconds
```

---

## warnOnce

Warn message only once

### Parameters

- **message**: warning message

### Example

```ts
import { warnOnce } from '@ntnyq/utils'

warnOnce('Deprecated API')
warnOnce('Deprecated API') // only warns once
```
