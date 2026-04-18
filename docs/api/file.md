---
title: File Utilities
outline: deep
---

# File Utilities

Small helpers for file path and extension handling.

This section documents 2 exported methods from the file module.

## Methods

- [getFileExtension](#getfileextension)
- [removeFileExtension](#removefileextension)

---

## getFileExtension

Gets the file extension from a filename.

### Parameters

- **filePath**: The filePath to get the extension from.

### Returns

The file extension, or undefined if there is none.

### Example

```ts
import { getFileExtension } from '@ntnyq/utils'

const result = getFileExtension('photo.jpg')
console.log(result) // => 'jpg'
```

---

## removeFileExtension

Removes the file extension from a filename.

### Parameters

- **filename**: The filename to remove the extension from.

### Returns

The filename without the extension.

### Example

```ts
import { removeFileExtension } from '@ntnyq/utils'

const result = removeFileExtension('archive.tar.gz')
console.log(result) // => 'archive.tar'
```
