---
title: Unit Conversion and Formatting
outline: deep
---

# Unit Conversion and Formatting

Convert and format byte counts and elapsed time.

## Byte size

`convertToBytes`, `convertFromBytes`, and `convertStorageUnit` convert
between `BYTE`, `KB`, `MB`, `GB`, and `TB`. The `STORAGE_UNITS`
table and `StorageUnit` type are exported from the same byte-size module.

```ts
import { convertStorageUnit } from '@ntnyq/utils'

convertStorageUnit(1, 'GB', 'MB') // => 1024
```

### formatByteSize

`formatByteSize(bytes, options?)` scales a finite, non-negative byte count by
1024 and selects the unit before rounding. Labels range from `B` to `EB`
(`EiB` in IEC style). Larger values continue to use the largest label.

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
```

| `FormatByteSizeOptions` | Default   | Behavior                                          |
| ----------------------- | --------- | ------------------------------------------------- |
| `digits`                | `2`       | Fraction digits, from 0 through 100.              |
| `omitTrailingZeros`     | `true`    | Set to `false` to keep exactly `digits` decimals. |
| `separator`             | `' '`     | Text between the number and the unit.             |
| `unitStyle`             | `'short'` | Use `'iec'` for `KiB`, `MiB`, and larger labels.  |

Negative or non-finite byte counts and invalid precision throw a `RangeError`.

## Duration

`convertToMilliseconds`, `convertFromMilliseconds`, and
`convertTimeUnit` convert between duration units. `TIME_UNITS` and the
`TimeUnit` type are owned by the duration module.

```ts
import { convertTimeUnit } from '@ntnyq/utils'

convertTimeUnit(2, 'HOUR', 'MINUTE') // => 120
```

### formatDurationClock

`formatDurationClock(seconds, options?)` formats elapsed seconds in
`HH:mm:ss`. Hours accumulate across days. Set `FormatDurationClockOptions.mode`
to `'totalMinutes'` to show cumulative minutes and seconds instead. Both modes
use at least two digits per field, round fractional seconds down, and treat
negative or non-finite durations as zero.

```ts
import { formatDurationClock } from '@ntnyq/utils'

formatDurationClock(90_061) // '25:01:01'
formatDurationClock(3_661.9, { mode: 'totalMinutes' }) // '61:01'
formatDurationClock(-1) // '00:00:00'
```
