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
  With `cache: false`, HTTP(S) and relative URLs receive a cache-busting query
  parameter. Other schemes, including `data:` and `blob:`, remain unchanged.

```ts
import { loadImageDimensions } from '@ntnyq/utils'

const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"/>'
const source = `data:image/svg+xml,${encodeURIComponent(svg)}`
const size = await loadImageDimensions(source)
console.log(size) // => { width: 40, height: 20 }
```

## File

- `validateFile` checks byte-size, MIME-type, and filename-extension
  constraints and returns all validation issues without throwing for ordinary
  invalid files. Custom typed validation rules and early exit are supported.

```ts
import { validateFile } from '@ntnyq/utils'

const file = new File(['name,age\nAlice,30'], 'people.csv', {
  type: 'text/csv',
})
const result = validateFile(file, {
  allowedExtensions: ['csv'],
  allowedMimeTypes: ['text/csv'],
  maxSize: 1024,
})
console.log(result.isValid) // => true
```

When validation fails, read `result.issues` for the reasons.

## Animation frame

- `getGlobalRoot` returns the browser window or `globalThis`.
- `requestFrame` and `cancelFrame` wrap animation-frame scheduling and
  cancellation.

```ts
import { isBrowser, loadImageDimensions, requestFrame } from '@ntnyq/utils'

if (isBrowser()) {
  requestFrame(() => console.log('next frame'))
  const dimensions = await loadImageDimensions('/logo.png')
  console.log(dimensions)
}
```
