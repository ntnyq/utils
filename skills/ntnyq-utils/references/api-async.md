# Async

Source: `docs/api/async.md`, `src/async/`, `tests/async.test.ts`, and
`tests/types.async-api.test.ts`.

`createDeferred` and `raceWithSignal` were added after v0.25.0. Check the
installed package's exports and declarations before using them.

## External Resolution

Use `createDeferred<Value>()` when an event callback or response handler must
settle a promise consumed elsewhere. It returns `Deferred<Value>` with
`promise: Promise<Value>`, `resolve(value: Value | PromiseLike<Value>)`, and
`reject(reason: unknown)`. The value type defaults to `unknown`;
`createDeferred<void>()` allows `resolve()` without an argument.

```ts
import { createDeferred } from '@ntnyq/utils'
import type { Deferred } from '@ntnyq/utils'

const ready: Deferred<string> = createDeferred<string>()
setTimeout(() => ready.resolve('ready'), 100)
const value = await ready.promise // 'ready'
```

The first resolve or reject call locks the result, including when resolving
with a pending promise-like value. Later calls are ignored while that value
is pending. A promise-like resolution adopts its eventual value or rejection;
rejection preserves the original reason. This helper uses the Promise
constructor rather than `Promise.withResolvers`. It does not schedule or
cancel work, and remains pending until settled. Consumers must handle rejection.

## Abort Waiting

`raceWithSignal(task, signal)` accepts `PromiseLike<Value>` and returns
`Promise<Awaited<Value>>`. It preserves the task's value or rejection when the
task wins; abort rejects with the exact `signal.reason`. An already aborted
signal takes precedence even over an already settled task.

```ts
import { createDeferred, raceWithSignal } from '@ntnyq/utils'

const task = createDeferred<string>()
const controller = new AbortController()
const result = raceWithSignal(task.promise, controller.signal)
controller.abort(new Error('Stopped waiting'))

try {
  await result
} catch (error) {
  console.log(error === controller.signal.reason) // true
}
```

The abort listener is removed on settlement, and a later task rejection is
still observed. Aborting stops waiting; the underlying task can continue.
Pass the signal to the operation creating the task for cooperative cancellation.

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
const response = await retry(
  ({ signal }) => fetch('/api/data', { signal: signal ?? null }),
  {
    maxAttempts: 3,
    backoff: (_error, { attempt }) => 100 * 2 ** (attempt - 1),
    shouldRetry: error => error instanceof TypeError,
    signal: controller.signal,
  },
)
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
