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

Creates a reflective proxy view that overlays properties on a target object.
Overlay values take precedence even when the source target is frozen.
Writes and deletions are forwarded to the source target. Property definitions
must remain configurable: specify `configurable: true` for new properties.
Non-configurable definitions are rejected before the target changes
(`Reflect.defineProperty` returns `false`; `Object.defineProperty` throws).

### Parameters

- **target**: The original object to proxy.
- **overlay**: Properties that take precedence over the target object.

### Returns

A proxy object that reads and enumerates overlay properties before target
properties.

### Example

```ts
import { createOverlayProxy } from '@ntnyq/utils'

const target = { a: 1 }
const proxy = createOverlayProxy(target, { b: 2 })
console.log(proxy.b) // => 2
console.log(Object.keys(proxy)) // => ['a', 'b']
```
