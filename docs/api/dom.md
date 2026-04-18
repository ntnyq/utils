---
title: DOM Utilities
outline: deep
---

# DOM Utilities

Browser-side helpers for viewport checks, scrolling, image inspection, and opening links.

This section documents 4 exported methods from the dom module.

## Methods

- [getImageNaturalSize](#getimagenaturalsize)
- [isElementVisibleInViewport](#iselementvisibleinviewport)
- [openExternalURL](#openexternalurl)
- [scrollElementIntoView](#scrollelementintoview)

---

## getImageNaturalSize

Gets the natural width and height of an image source.

### Parameters

- **source**: The image URL, Blob, or File to inspect.
- **options**: Options for timeout, decoding, cross-origin mode, and caching.

### Returns

A promise that resolves with the image's natural size.

### Example

```ts
import { getImageNaturalSize } from '@ntnyq/utils'

const size = await getImageNaturalSize('/logo.png')
console.log(size.width, size.height) // => natural image size
```

---

## isElementVisibleInViewport

Check if element is in viewport

### Parameters

- **element**: checked element
- **targetWindow**: window

### Returns

true if element is in viewport, false otherwise

### Example

```ts
import { isElementVisibleInViewport } from '@ntnyq/utils'

const element = document.getElementById('app')!
const result = isElementVisibleInViewport(element)
console.log(result) // => true
```

---

## openExternalURL

Open external url

### Parameters

- **url**: URL to open
- **options**: open options

### Returns

window proxy

### Example

```ts
import { openExternalURL } from '@ntnyq/utils'

openExternalURL('https://github.com', { target: '_blank' })
```

---

## scrollElementIntoView

Scrolls an element into view when it is outside the visible area.

### Parameters

- **element**: The target element to reveal.
- **options**: Scrolling behavior and parent container options.

### Returns

Nothing.

### Example

```ts
import { scrollElementIntoView } from '@ntnyq/utils'

const element = document.getElementById('target')!
scrollElementIntoView(element, { behavior: 'smooth' })
```
