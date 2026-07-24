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
- `scrollElementIntoView` reveals an element when it falls outside either the
  horizontal or vertical bounds of its parent.
- `openExternalURL` opens a URL with configurable window features.

## Image

- `loadImageDimensions` loads a URL, Blob, or File and resolves its natural
  dimensions. It supports timeout, decoding, cross-origin, and cache options.

## File

- `validateFile` checks byte-size, MIME-type, and filename-extension
  constraints and returns all validation issues without throwing for ordinary
  invalid files. Custom typed validation rules and early exit are supported.

```ts
import { validateFile } from '@ntnyq/utils'

const result = validateFile(file, {
  allowedExtensions: ['pdf'],
  allowedMimeTypes: ['application/pdf'],
  maxSize: 10 * 1024 * 1024,
})

if (!result.isValid) {
  console.log(result.issues)
}
```

## Animation frame

- `getGlobalRoot` returns the browser window or `globalThis`.
- `requestFrame` and `cancelFrame` wrap animation-frame scheduling and
  cancellation.
- `getRoot`, `rAF`, and `cAF` remain as deprecated compatibility names.

```ts
import { isBrowser, loadImageDimensions, requestFrame } from '@ntnyq/utils'

if (isBrowser()) {
  requestFrame(() => console.log('next frame'))
  const dimensions = await loadImageDimensions('/logo.png')
  console.log(dimensions)
}
```
