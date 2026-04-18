---
title: Number Utilities
outline: deep
---

# Number Utilities

Helpers for random numbers, rounding, and number coercion.

This section documents 4 exported methods from the number module.

## Methods

- [randomNumber](#randomnumber)
- [round](#round)
- [toInteger](#tointeger)
- [toNumber](#tonumber)

---

## randomNumber

random an integer by given range

### Parameters

- **min**: min value
- **max**: max value

### Returns

random integer in range

### Example

```ts
import { randomNumber } from '@ntnyq/utils'

const result = randomNumber(10)
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
