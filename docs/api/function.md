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

const fn = compose(
  (n: number) => `v:${n}`,
  (n: number) => n * 2,
  (n: number) => n + 1,
)

console.log(fn(2)) // => 'v:6'
```

---

## memoize

Memoizes a function with optional custom key resolver and cache size limit.

### Parameters

- **func**: Function to memoize.
- **options**: Memoize options (`resolver`, `maxSize`).

### Returns

A memoized function with `.cache` and `.clear()` helpers.

### Example

```ts
import { memoize } from '@ntnyq/utils'

const heavy = memoize((n: number) => n * n)
console.log(heavy(4)) // => 16
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

const fn = pipe(
  (value: string) => value.trim(),
  value => value.toUpperCase(),
)

console.log(fn('  hi  ')) // => 'HI'
```

---

## debounce

Creates a debounced function with a `cancel()` method.

```ts
import { debounce } from '@ntnyq/utils'

const search = debounce(300, (query: string) => console.log(query))
search('utils')
search.cancel()
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
