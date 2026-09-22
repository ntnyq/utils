# Units

Source: `docs/api/units.md`, `src/units/`, `tests/units.test.ts`.

## Byte Sizes

`StorageUnit` is a key of `STORAGE_UNITS`: `'BYTE'`, `'KB'`, `'MB'`, `'GB'`,
or `'TB'`. Each step uses 1024, despite the shorter unit names.

- `convertToBytes(value, fromUnit = 'MB')`
- `convertFromBytes(bytes, toUnit = 'MB')`
- `convertStorageUnit(value, fromUnit, toUnit)`

## Durations

`TimeUnit` is a key of `TIME_UNITS`: `'MILLISECOND'`, `'SECOND'`, `'MINUTE'`,
`'HOUR'`, `'DAY'`, or `'WEEK'`. Values use fixed elapsed durations, with 24 hours
per day and 7 days per week; they are not calendar or time-zone calculations.

- `convertToMilliseconds(value, fromUnit = 'SECOND')`
- `convertFromMilliseconds(milliseconds, toUnit = 'SECOND')`
- `convertTimeUnit(value, fromUnit, toUnit)`

```ts
import {
  convertStorageUnit,
  convertTimeUnit,
  convertToBytes,
} from '@ntnyq/utils'

convertToBytes(2) // 2097152 (2 MB)
convertStorageUnit(1, 'GB', 'MB') // 1024
convertTimeUnit(2, 'HOUR', 'MINUTE') // 120
```

Units are uppercase string keys. Conversions return numbers without formatting
or rounding; choose numeric formatting separately when producing labels.
