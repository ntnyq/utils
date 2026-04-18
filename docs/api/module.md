---
title: Module Utilities
outline: deep
---

# Module Utilities

Helpers for working with modules and nested option resolution.

This section documents 2 exported methods from the module module.

## Methods

- [interopDefault](#interopdefault)
- [resolveSubOptions](#resolvesuboptions)

---

## interopDefault

Interop default export from a module

### Parameters

- **mod**: The module

### Returns

The default export

### Example

```ts
import { interopDefault } from '@ntnyq/utils'

const { unindent } = await interopDefault(import('@ntnyq/utils'))
```

---

## resolveSubOptions

Resolve sub options `boolean | Options` to `Options`

### Parameters

- **options**: core options
- **key**: sub options key

### Returns

resolved sub options

### Example

```ts
import { resolveSubOptions } from '@ntnyq/utils'

interface Options {
  compile?:
    | boolean
    | {
        include?: string[]
        exclude?: string[]
      }
}

const options: Options = {
  compile: true,
}

console.log(resolveSubOptions(options, 'compile'))

// => {}
```
