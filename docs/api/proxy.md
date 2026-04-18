---
title: Proxy Utilities
outline: deep
---

# Proxy Utilities

Helpers for enhancing objects through proxy-based composition.

This section documents 1 exported method from the proxy module.

## Methods

- [enhance](#enhance)

---

## enhance

Creates a proxy that enhances an object with additional fallback properties.

### Parameters

- **module**: The original object to proxy.
- **extra**: Additional properties to expose through the proxy.

### Returns

A proxy object that reads from the extra object before the original object.

### Example

```ts
import { enhance } from '@ntnyq/utils'

const target = { a: 1 }
const proxy = enhance(target, { b: 2 })
console.log(proxy.b) // => 2
```
