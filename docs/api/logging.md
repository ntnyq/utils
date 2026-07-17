---
title: Logging Utilities
outline: deep
---

# Logging Utilities

## warnOnce

Writes each distinct warning message at most once for the lifetime of the
module instance.

```ts
import { warnOnce } from '@ntnyq/utils'

warnOnce('Deprecated API')
warnOnce('Deprecated API') // ignored
```
