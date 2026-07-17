---
title: Web Utilities
outline: deep
---

# Web Utilities

Browser-specific helpers are isolated from the framework-agnostic predicate
and utility modules.

## Environment

- `isBrowser` checks whether DOM globals are available.

## DOM

- `isHTMLElement` checks DOM elements and remains safe in non-browser runtimes.
- `isElementVisibleInViewport` checks viewport intersection.
- `scrollElementIntoView` reveals an element when necessary.
- `openExternalURL` opens a URL with configurable window features.

## Image

- `getImageNaturalSize` resolves the natural dimensions of a URL, Blob, or
  File source and supports timeout, decoding, cross-origin, and cache options.

## Animation frame

- `getRoot` returns the browser window or `globalThis`.
- `rAF` and `cAF` wrap animation-frame scheduling and cancellation.

```ts
import { getImageNaturalSize, isBrowser, rAF } from '@ntnyq/utils'

if (isBrowser()) {
  rAF(() => console.log('next frame'))
  const size = await getImageNaturalSize('/logo.png')
  console.log(size)
}
```
