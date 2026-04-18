---
title: Function Utilities
outline: deep
---

# Function Utilities

Function flow helpers such as one-time invocation and no-op utilities.

This section documents 2 exported methods from the fn module.

## Methods

- [noop](#noop)
- [once](#once)

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
