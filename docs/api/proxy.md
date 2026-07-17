---
title: Proxy Utilities
outline: deep
---

# Proxy Utilities

Helpers for overlaying object properties through proxy-based composition.

This section documents 1 exported method from the proxy module.

## Methods

- [createOverlayProxy](#createoverlayproxy)

---

## createOverlayProxy

Creates a proxy that overlays properties on a target object.

### Parameters

- **target**: The original object to proxy.
- **overlay**: Properties that take precedence over the target object.

### Returns

A proxy object that reads from the overlay before the target object.

### Example

```ts
import { createOverlayProxy } from '@ntnyq/utils'

const target = { a: 1 }
const proxy = createOverlayProxy(target, { b: 2 })
console.log(proxy.b) // => 2
```
