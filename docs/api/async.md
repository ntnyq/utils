---
title: Async Utilities
outline: deep
---

# Async Utilities

Small asynchronous control-flow helpers.

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
