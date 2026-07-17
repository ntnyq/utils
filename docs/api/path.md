---
title: Path Utilities
outline: deep
---

# Path Utilities

Pure string helpers for path separators and file extensions; no file system I/O is performed.

This section documents 3 exported methods from the path module.

## Methods

- [getFileExtension](#getfileextension)
- [normalizePathSlashes](#normalizepathslashes)
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

---

## normalizePathSlashes

Normalizes backslashes to forward slashes without touching the file system.

```ts
import { normalizePathSlashes } from '@ntnyq/utils'

normalizePathSlashes('src\\path\\index.ts') // => 'src/path/index.ts'
```
