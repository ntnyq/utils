---
title: Function Utilities
outline: deep
---

# Function Utilities

Function composition, memoization, invocation control, throttling, and debouncing helpers.

This section documents 8 exports from the function module.

## Methods

- [compose](#compose)
- [debounce](#debounce)
- [memoize](#memoize)
- [NOOP](#noop-constant)
- [noop](#noop)
- [once](#once)
- [pipe](#pipe)
- [throttle](#throttle)

---

## compose

Composes functions from right to left.

### Parameters

- **fns**: Functions to compose.

### Returns

A composed function.

### Example

```ts
import { compose } from '@ntnyq/utils'

const calculate = compose(
  (value: number) => value * 2,
  (value: number) => value + 1,
)
console.log(calculate(3)) // => 8
```

---

## memoize

Memoizes a function with optional custom key resolver and cache size limit.
Synchronous failures are not cached and do not retain argument identities;
later calls can retry. Returned promises are cached as values.

### Parameters

- **func**: Function to memoize.
- **options**: Memoize options (`resolver`, `maxSize`).

### Returns

A memoized function with `.cache` and `.clear()` helpers.
Calling `.cache.clear()` or `.cache.delete(key)` also releases the associated
argument identities, keeping the optional size bound effective.

### Example

```ts
import { memoize } from '@ntnyq/utils'

const createPoint = memoize((x: number, y: number) => ({ x, y }))
const point = createPoint(2, 3)
console.log(createPoint(2, 3) === point) // => true
```

### Clear the cache

```ts
import { memoize } from '@ntnyq/utils'

const square = memoize((value: number) => value ** 2)
square(4)
square.clear()
console.log(square.cache.size) // => 0
```

---

## NOOP constant

An uppercase alias of [`noop`](#noop), useful when a stable no-op callback value
is needed.

```ts
import { NOOP } from '@ntnyq/utils'

button.addEventListener('click', NOOP)
```

---

## noop

A function that does nothing.

### Returns

Nothing.

### Example

```ts
import { noop } from '@ntnyq/utils'

noop() // does nothing
```

---

## once

Creates a function that is restricted to invoking `func` once. Repeat calls to the function return `false`.

### Parameters

- **func**: The function to restrict.

### Returns

A new function that returns `true` when `func` is invoked for the first time and `false` on subsequent calls.

### Example

```ts
const initialize = once(() => {
  console.log('Initialized')
})

initialize() // Logs: 'Initialized', returns true
```

---

## pipe

Pipes functions from left to right.

### Parameters

- **fns**: Functions to execute in order.

### Returns

A piped function.

### Example

```ts
import { pipe } from '@ntnyq/utils'

const calculate = pipe(
  (value: number) => value * 2,
  (value: number) => value + 1,
)
console.log(calculate(3)) // => 7
```

---

## debounce

Creates a trailing-edge debounced function with a `cancel()` method. The latest
call runs after no new calls arrive for the configured delay. Cancelling clears
pending work without disabling future calls.

```ts
import { debounce } from '@ntnyq/utils'

const search = debounce(300, (query: string) => console.log(query))
search('utils')
search('utils library') // only this value is logged after 300 ms
```

### Cancel a pending debounced call

```ts
import { debounce } from '@ntnyq/utils'

const save = debounce(300, () => console.log('saved'))
save()
save.cancel() // cancels the scheduled save
```

---

## throttle

Limits a function to at most one execution per interval and exposes
`cancel()` for pending work.

```ts
import { throttle } from '@ntnyq/utils'

const onResize = throttle(200, () => console.log('resized'))
window.addEventListener('resize', onResize)
```

### Cancel a pending trailing call

```ts
import { throttle } from '@ntnyq/utils'

const update = throttle(200, (value: number) => console.log(value))
update(1) // logs 1 immediately
update(2) // schedules a trailing call
update.cancel()
```
