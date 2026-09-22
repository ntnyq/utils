# Logging

Source: `docs/api/logging.md`, `src/logging/warnOnce.ts`,
`tests/logging.test.ts`.

```ts
import { warnOnce } from '@ntnyq/utils'

warnOnce('Deprecated option')
warnOnce('Deprecated option') // suppressed
warnOnce('Another option') // emitted
```

`warnOnce(message)` deduplicates by the exact message string for the lifetime
of the module instance. Different messages still log. Use stable messages
when repeated calls should collapse; interpolating changing values creates
different keys. The public API has no reset method.
