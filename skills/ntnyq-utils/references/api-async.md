# Async

Source: `docs/api/async.md`, `src/async/`, `tests/async.test.ts`.

## Concurrency

```ts
import { mapAsync } from '@ntnyq/utils'

const doubled = await mapAsync([1, 2, 3], async value => value * 2, {
  concurrency: 2,
})
// [2, 4, 6], in input order
```

`mapAsync(items, mapper, options)` snapshots source items before scheduling.
The mapper receives `(item, index, signal)`. Concurrency defaults to `Infinity`;
a finite limit must be a positive integer. An error or abort stops new work.
Already running work must observe the supplied signal to stop cooperatively.

## Retry

```ts
import { retry } from '@ntnyq/utils'

const controller = new AbortController()
const response = await retry(({ signal }) => fetch('/api/data', { signal }), {
  maxAttempts: 3,
  backoff: (_error, { attempt }) => 100 * 2 ** (attempt - 1),
  shouldRetry: error => error instanceof TypeError,
  signal: controller.signal,
})
```

The operation receives `{ attempt, maxAttempts, signal }`; attempts start at 1.
`maxAttempts` includes the initial call and defaults to 3. `backoff` is a delay
in milliseconds or `(error, context) => delay`, defaulting to zero. Delays must
be finite and non-negative; attempts must be a positive integer.
`shouldRetry(error, context)` may be async and defaults to retrying every error.

Only thrown errors or rejections trigger retry. `fetch` resolves for HTTP error
responses, so explicitly check response status and throw when appropriate.
Abort rejects promptly during an attempt, retry decision, or delay, but cannot
undo an operation's effects. Pass its signal to cancellable operations.

## Delay

`await waitFor(milliseconds)` resolves after a timer. It takes no abort option.
