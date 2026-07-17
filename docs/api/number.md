---
title: Number Utilities
outline: deep
---

# Number Utilities

Helpers for ranges, random numbers, rounding, and number coercion.

This section documents 6 exported methods from the number module.

## Methods

- [clamp](#clamp)

- [randomInteger](#randominteger)
- [round](#round)
- [toFixed](#tofixed)
- [toInteger](#tointeger)
- [toNumber](#tonumber)

---

## randomInteger

Generate a random integer within the given range.

### Parameters

- **min**: min value
- **max**: max value

### Returns

A random integer within the range.

### Example

```ts
import { randomInteger } from '@ntnyq/utils'

const result = randomInteger(10)
console.log(result) // => a number between 0 and 9
```

---

## round

Rounds a number to a specified number of decimal places.

### Parameters

- **value**: The number to round.
- **decimal**: The number of decimal places to round to. Default is 0 (round to the nearest integer).

### Returns

The rounded number.

### Example

```ts
import { round } from '@ntnyq/utils'

round(1.2345) //=> 1
round(1.2345, 2) //=> 1.23
```

---

## toFixed

Formats a number using fixed-point notation.

### Parameters

- **num**: The number to format.
- **options**: An object containing formatting options.
  - **digits**: The number of digits after the decimal point. Default is `2`.
  - **omitTrailingZeros**: Whether to omit trailing zeros after the decimal point. Default is `true`.

### Returns

A string representing the formatted number.

### Example

```ts
import { toFixed } from '@ntnyq/utils'

toFixed(123.456) // => '123.46'
toFixed(123.456, { digits: 1 }) // => '123.5'
toFixed(123.4, { omitTrailingZeros: false }) // => '123.40'
toFixed(123.4, { digits: 3, omitTrailingZeros: false }) // => '123.400'
toFixed(123.4, { digits: 3 }) // => '123.4'
toFixed(123.0) // => '123'
```

---

## toInteger

Converts a value to an integer using the provided conversion options.

### Parameters

- **value**: The value to convert.
- **options**: Options that control error handling, range limits, and decimal support.

### Returns

The converted integer result.

### Example

```ts
import { toInteger } from '@ntnyq/utils'

const result = toInteger('42')
console.log(result) // => 42
```

---

## toNumber

Converts `value` to a number.

### Parameters

- **value**: The value to process.

### Returns

Returns the number.

### Example

```ts
import { toNumber } from '@ntnyq/utils'

const result = toNumber('3.14')
console.log(result) // => 3.14
```

---

## clamp

Clamps a number to an inclusive range.

```ts
import { clamp } from '@ntnyq/utils'

clamp(15, 0, 10) // => 10
```
