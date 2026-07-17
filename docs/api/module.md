---
title: Module Utilities
outline: deep
---

# Module Utilities

## interopDefault

Unwraps a module's default export while preserving modules without one and
falsy default values.

```ts
import { interopDefault } from '@ntnyq/utils'

const utils = await interopDefault(import('@ntnyq/utils'))
```
