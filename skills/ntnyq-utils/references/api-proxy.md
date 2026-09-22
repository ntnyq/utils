# Proxy

Source: `docs/api/proxy.md`, `src/proxy/createOverlayProxy.ts`,
`tests/proxy.test.ts`.

```ts
import { createOverlayProxy } from '@ntnyq/utils'

const target = { theme: 'light', count: 1 }
const view = createOverlayProxy(target, { theme: 'dark' })
view.theme // 'dark'
view.count = 2 // target.count becomes 2
view.theme = 'system' // target changes, but the overlay still reads 'dark'
```

This is a reflective view: reads prefer overlay properties, including over a
frozen source. Enumeration exposes target and overlay keys. Writes and
deletions go to the target, so deleting a target property does not remove an
overlay value. It is not a detached merged copy.

New property definitions through the proxy must set `configurable: true`.
Non-configurable definitions are rejected before changing the target:
`Reflect.defineProperty` returns false and `Object.defineProperty` throws.
