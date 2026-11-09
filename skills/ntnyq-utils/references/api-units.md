# Units

Source: `docs/api/units.md`, `src/units/`, `tests/units.test.ts`.

`formatByteSize` and `formatDurationClock` were added after v0.25.0. Check the
installed package's exports and declarations before using them.

## Byte Sizes

`StorageUnit` is a key of `STORAGE_UNITS`: `'BYTE'`, `'KB'`, `'MB'`, `'GB'`,
or `'TB'`. Each step uses 1024, despite the shorter unit names.

- `convertToBytes(value, fromUnit = 'MB')`
- `convertFromBytes(bytes, toUnit = 'MB')`
- `convertStorageUnit(value, fromUnit, toUnit)`

### Formatting Byte Counts

`formatByteSize(bytes, options?)` formats a finite, non-negative byte count.
Both label styles scale by 1024, from `B` through `EB` or `EiB`; values above
that range keep the largest label. These formatting labels extend beyond the
conversion helpers' `StorageUnit` keys, which stop at `'TB'`.

| `FormatByteSizeOptions` | Default   | Behavior                                                         |
| ----------------------- | --------- | ---------------------------------------------------------------- |
| `digits`                | `2`       | Integer fraction precision from 0 through 100                    |
| `omitTrailingZeros`     | `true`    | Set to `false` for exactly `digits` decimals                     |
| `separator`             | `' '`     | Text between the value and unit label                            |
| `unitStyle`             | `'short'` | `'short'` uses `KB`, `MB`, etc.; `'iec'` uses `KiB`, `MiB`, etc. |

```ts
import { formatByteSize } from '@ntnyq/utils'

formatByteSize(0) // '0 B'
formatByteSize(1536) // '1.5 KB'
formatByteSize(1024, { separator: '' }) // '1KB'
formatByteSize(1024, {
  digits: 1,
  omitTrailingZeros: false,
  unitStyle: 'iec',
}) // '1.0 KiB'
formatByteSize(1_048_575) // '1024 KB': unit selection happens before rounding
```

The numeric part uses `en-US` formatting without grouping. Negative or
non-finite byte counts and invalid precision throw `RangeError`.

## Durations

`TimeUnit` is a key of `TIME_UNITS`: `'MILLISECOND'`, `'SECOND'`, `'MINUTE'`,
`'HOUR'`, `'DAY'`, or `'WEEK'`. Values use fixed elapsed durations, with 24 hours
per day and 7 days per week; they are not calendar or time-zone calculations.

- `convertToMilliseconds(value, fromUnit = 'SECOND')`
- `convertFromMilliseconds(milliseconds, toUnit = 'SECOND')`
- `convertTimeUnit(value, fromUnit, toUnit)`

### Formatting Elapsed Seconds

`formatDurationClock(seconds, options?)` takes **seconds**, while
`convertToMilliseconds` and `TIME_UNITS` use milliseconds. Its default
`FormatDurationClockOptions.mode` is `'hours'`, producing `HH:mm:ss` with
cumulative hours across days. Use `'totalMinutes'` for cumulative `mm:ss`.
Fields have at least two digits; hours and total minutes can grow beyond two.
Fractional seconds round down; negative and non-finite inputs become zero.

```ts
import { convertFromMilliseconds, formatDurationClock } from '@ntnyq/utils'

formatDurationClock(90_061) // '25:01:01'
formatDurationClock(3_661.9, { mode: 'totalMinutes' }) // '61:01'
formatDurationClock(-1) // '00:00:00'
formatDurationClock(convertFromMilliseconds(90_000)) // '00:01:30'
```

## Conversion Examples

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

Conversion units are uppercase string keys. Conversions return numbers without
formatting or rounding; use the formatters above when producing labels.
