---
title: Number Utilities
outline: deep
---

# Number Utilities

Helpers for ranges, random numbers, rounding, number coercion, and Chinese
numeral formatting.

This section documents 8 exported methods from the number module.

## Methods

- [clamp](#clamp)
- [digitsToChinese](#digitstochinese)
- [randomInteger](#randominteger)
- [round](#round)
- [toChineseNumber](#tochinesenumber)
- [toFixed](#tofixed)
- [toInteger](#tointeger)
- [toNumber](#tonumber)

---

## digitsToChinese

Replaces each ASCII digit with its Chinese numeral counterpart while preserving
all other characters. This is useful for years, phone numbers, and identifiers
that should be read digit by digit.

### Parameters

- **value**: The number or string to convert.

### Returns

A string with each digit converted independently.

### Example

```ts
import { digitsToChinese } from '@ntnyq/utils'

digitsToChinese(2026) // => '二零二六'
digitsToChinese('020-1234') // => '零二零-一二三四'
```

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

## toChineseNumber

Converts a safe integer to its spoken Chinese numeral representation, including
negative values and units up to `万亿`.

### Parameters

- **value**: The safe integer to convert.

### Returns

The spoken Chinese numeral representation.

### Throws

Throws a `TypeError` when `value` is not a safe integer.

### Example

```ts
import { toChineseNumber } from '@ntnyq/utils'

toChineseNumber(10) // => '十'
toChineseNumber(1024) // => '一千零二十四'
toChineseNumber(10001) // => '一万零一'
toChineseNumber(-2026) // => '负二千零二十六'
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
toFixed(100, { digits: 0 }) // => '100'
toFixed(0, { digits: 0 }) // => '0'
```

---

## toInteger

Converts a value to an integer using the provided conversion options.

### Parameters

- **value**: The value to convert.
- **options**: Options that control error handling, range limits, and decimal support.

### Returns

The converted integer result. With `onError: 'returnOriginal'`, failed
conversions return the original input. The return type includes the input type
whenever the supplied options may select that behavior, including options
stored in a `ToIntegerOptions` variable.

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
