# Number

Source: `docs/api/number.md`, `src/number/`, `tests/number.test.ts`.

## Coercion and Formatting

| API                         | Contract                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `clamp(value, min, max)`    | Constrains a number to inclusive bounds                                                      |
| `round(value, decimal = 0)` | Returns a rounded number                                                                     |
| `toFixed(value, options)`   | Returns a string; defaults to two decimal places and omits trailing zeros                    |
| `toNumber(value)`           | Accepts string or number; string conversion uses `parseFloat`; invalid numeric results throw |
| `toInteger(value, options)` | Configurable integer conversion; failed conversion defaults to `0`                           |

`toNumber('12px')` returns `12`; it is not a strict numeric-string validator.
`toInteger` converts strings with `Number` and rejects decimals by default.
Set `allowDecimal: true` to truncate toward zero. Options include:

- `defaultValue` (default `0`) and `allowNaN` (default `false`).
- `onError: 'useDefault' | 'throwError' | 'returnOriginal'`.
- Inclusive `min`/`max` with `outOfRange: 'clamp' | 'useDefault' | 'throwError'`.

When options can select `returnOriginal`, handle the original input type in
the result union. Do not assume conversion always returns a number.

```ts
import { toFixed, toInteger } from '@ntnyq/utils'

toInteger('3.9') // 0: decimals rejected
toInteger('3.9', { allowDecimal: true }) // 3
toInteger('bad', { onError: 'returnOriginal' }) // 'bad'
toFixed(12.3, { digits: 2, omitTrailingZeros: false }) // '12.30'
```

## Random Ranges

`randomInteger(max)` samples from zero through the exclusive maximum.
`randomInteger(min, max, { includeMax: true })` includes the upper bound.
Reversed bounds are swapped; non-finite bounds or ranges containing no integers
throw `RangeError`. Equal integer bounds return that integer.

## Chinese Numerals

`digitsToChinese(value)` replaces digits independently and preserves other
characters: `'020-1234'` becomes `'零二零-一二三四'`.
`toChineseNumber(value)` renders a spoken number with units: `1024` becomes
`'一千零二十四'`. The latter accepts safe integers only, including negatives;
invalid values throw `TypeError`.
