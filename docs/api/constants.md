---
title: Constants
outline: deep
---

# Constants

Reusable constants exported from the package entry.

## Character constants

### SPECIAL_CHAR

Named punctuation and whitespace characters, including commas, a period,
hyphen, newline, and space.

```ts
import { SPECIAL_CHAR } from '@ntnyq/utils'

console.log(SPECIAL_CHAR.hyphen) // => '-'
```

## Regular-expression constants

- `RE_COMMENTS` matches HTML and block comments.
- `RE_LINE_COMMENT` matches a JavaScript line comment.
- `RE_BLOCK_COMMENT` matches JavaScript block comments.

```ts
import { RE_LINE_COMMENT } from '@ntnyq/utils'

console.log(RE_LINE_COMMENT.test('// note')) // => true
```
