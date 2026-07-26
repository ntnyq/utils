---
title: Async Utilities
outline: deep
---

# Async Utilities

Small asynchronous control-flow helpers.

## retry

Retries synchronous or asynchronous work up to `maxAttempts` times. The
operation receives a 1-based attempt number and the configured `AbortSignal`.

Use a numeric `backoff` for a constant delay or a callback for strategies such
as exponential backoff. `shouldRetry` may return a boolean or a promise and can
stop retries for non-transient errors. Aborting rejects promptly during an
active attempt, the retry predicate, or a pending delay.

```ts
import { retry } from '@ntnyq/utils'

const controller = new AbortController()
const response = await retry(({ signal }) => fetch('/api/data', { signal }), {
  backoff: (_error, { attempt }) => 100 * 2 ** (attempt - 1),
  maxAttempts: 3,
  shouldRetry: error => error instanceof TypeError,
  signal: controller.signal,
})
```

---

## mapAsync

Maps array items with an optional positive-integer concurrency limit. Results
always follow input order, even when mapper calls finish out of order. Source
items are snapshotted before any mapper work is scheduled.

The default concurrency is `Infinity`. An `AbortSignal` stops new work and
rejects promptly; the signal is also passed to the mapper so active operations
can cooperate with cancellation. A mapper failure likewise stops scheduling
new items.

```ts
import { mapAsync } from '@ntnyq/utils'

const controller = new AbortController()
const result = await mapAsync(
  [1, 2, 3],
  async (value, index, signal) => {
    signal?.throwIfAborted()
    return `${index}:${value * 2}`
  },
  {
    concurrency: 2,
    signal: controller.signal,
  },
)
```

---

## waitFor

Resolves after the requested delay.

```ts
import { waitFor } from '@ntnyq/utils'

await waitFor(300)
```
