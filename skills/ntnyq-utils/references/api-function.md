# Function

Source: `docs/api/function.md`, `src/function/`, `tests/function.test.ts`.

## Timing and Invocation

```ts
import { debounce, once, throttle } from '@ntnyq/utils'

const search = debounce(300, (query: string) => console.log(query))
search('utils')
search('ntnyq utils') // latest call runs after 300 ms of inactivity
search.cancel() // discard the pending call

const onResize = throttle(200, () => console.log('resize'))
const initialize = once(() => console.log('initialized'))
initialize() // true
initialize() // false
```

- Delays come before callbacks and must be finite, non-negative milliseconds.
- `debounce` runs on the trailing edge. `throttle` runs the first call
  immediately, then retains the latest pending call within the interval.
- Both preserve callback arguments and receiver and expose `.cancel()`.
  Cancellation discards pending work; future calls still work.
- `once` reports whether it invoked the callback, rather than returning the
  callback's result. It marks itself called before invoking the callback, so a
  throwing first call also consumes the invocation.
- `noop` and its alias `NOOP` provide a stable callback that returns nothing.

## Memoization

`memoize(fn, { resolver, maxSize })` returns a function with `.cache` and
`.clear()`. Without a resolver, cache matching uses `Object.is` for each
argument and the `this` receiver; structurally identical objects remain
different keys. A custom resolver derives a single key from the arguments.

`maxSize` must be a positive integer and evicts the oldest inserted entry when
exceeded. This is insertion-order eviction. Synchronous throws are not cached;
returned promises are cached as values, including promises that later reject.
Use `.clear()` when the underlying data changes.

## Composition

`pipe(...functions)` runs left to right; `compose(...functions)` runs right to
left. They compose values synchronously and do not automatically await promises.

```ts
import { pipe } from '@ntnyq/utils'

const normalize = pipe(
  (value: string) => value.trim(),
  value => value.toUpperCase(),
)
normalize(' hello ') // 'HELLO'
```
