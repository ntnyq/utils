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

- `loadImageDimensions` loads a URL, Blob, or File and resolves its natural
  dimensions. It supports timeout, decoding, cross-origin, and cache options.

## Animation frame

- `getRoot` returns the browser window or `globalThis`.
- `rAF` and `cAF` wrap animation-frame scheduling and cancellation.

```ts
import { loadImageDimensions, isBrowser, rAF } from '@ntnyq/utils'

if (isBrowser()) {
  rAF(() => console.log('next frame'))
  const dimensions = await loadImageDimensions('/logo.png')
  console.log(dimensions)
}
```
