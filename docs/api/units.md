---
title: Unit Conversion
outline: deep
---

# Unit Conversion

Pure conversions grouped by physical meaning.

## Byte size

`convertToBytes`, `convertFromBytes`, and `convertStorageUnit` convert
between `BYTE`, `KB`, `MB`, `GB`, and `TB`. The `STORAGE_UNITS`
table and `StorageUnit` type are exported from the same byte-size module.

```ts
import { convertStorageUnit } from '@ntnyq/utils'

convertStorageUnit(1, 'GB', 'MB') // => 1024
```

## Duration

`convertToMilliseconds`, `convertFromMilliseconds`, and
`convertTimeUnit` convert between duration units. `TIME_UNITS` and the
`TimeUnit` type are owned by the duration module.

```ts
import { convertTimeUnit } from '@ntnyq/utils'

convertTimeUnit(2, 'HOUR', 'MINUTE') // => 120
```
