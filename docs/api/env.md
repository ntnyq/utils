---
title: Environment Utilities
outline: deep
---

# Environment Utilities

Environment detection helpers for browser-aware logic.

This section documents 1 exported method from the env module.

## Methods

- [isBrowser](#isbrowser)

---

## isBrowser

Checks if the code is running in a browser

### Returns

true if the code is running in a browser

### Example

```ts
import { isBrowser } from '@ntnyq/utils'

const result = isBrowser()
console.log(result) // => true
```
