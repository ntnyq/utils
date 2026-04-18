---
title: HTML Utilities
outline: deep
---

# HTML Utilities

Helpers for escaping and unescaping HTML-safe text.

This section documents 2 exported methods from the html module.

## Methods

- [escapeHTML](#escapehtml)
- [unescapeHTML](#unescapehtml)

---

## escapeHTML

Escapes HTML special characters in a string.

### Parameters

- **str**: The string to escape.

### Returns

The escaped HTML string.

### Example

```ts
import { escapeHTML } from '@ntnyq/utils'

const result = escapeHTML('<div>Hello</div>')
console.log(result) // => '&lt;div&gt;Hello&lt;/div&gt;'
```

---

## unescapeHTML

Unescapes HTML entities in a string.

### Parameters

- **str**: The HTML-escaped string.

### Returns

The unescaped string.

### Example

```ts
import { unescapeHTML } from '@ntnyq/utils'

const result = unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;')
console.log(result) // => '<div>Hello</div>'
```
