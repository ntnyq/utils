---
title: String Utilities
outline: deep
---

# String Utilities

String formatting, normalization, padding, randomization, and similarity helpers.

This section documents 14 exported values from the string module.

## Exports

- [SPECIAL_CHAR](#special_char)

- [createPadString](#createpadstring)
- [ensurePrefix](#ensureprefix)
- [ensureSuffix](#ensuresuffix)
- [escapeStringRegexp](#escapestringregexp)
- [countGraphemes](#countgraphemes)
- [calculateNGramSimilarity](#calculatengramsimilarity)
- [getLetterByIndex](#getletterbyindex)
- [joinNonEmptyValues](#joinnonemptyvalues)
- [randomString](#randomstring)
- [slugify](#slugify)
- [truncate](#truncate)
- [unindent](#unindent)

---

## createPadString

Creates a function that left-pads a string to a fixed length.

### Parameters

- **options**: Padding options including target length and fill character.

### Returns

A function that pads incoming strings to the desired length.

### Example

```ts
import { createPadString } from '@ntnyq/utils'

const pad = createPadString({ length: 5, char: '0' })
console.log(pad('42')) // => '00042'
```

---

## ensurePrefix

Ensures that a string starts with the specified prefix.

### Parameters

- **input**: The input string to process.
- **prefix**: The prefix to prepend when it is missing.

### Returns

The original string or a new string with the prefix added.

### Example

```ts
import { ensurePrefix } from '@ntnyq/utils'

const result = ensurePrefix('world', 'hello ')
console.log(result) // => 'hello world'
```

---

## ensureSuffix

Ensures that a string ends with the specified suffix.

### Parameters

- **input**: The input string to process.
- **suffix**: The suffix to append when it is missing.

### Returns

The original string or a new string with the suffix added.

### Example

```ts
import { ensureSuffix } from '@ntnyq/utils'

const result = ensureSuffix('file', '.txt')
console.log(result) // => 'file.txt'
```

---

## escapeStringRegexp

Escapes special regular expression characters in a string.

### Parameters

- **value**: The string to escape.

### Returns

A string that can be safely used inside a regular expression.

### Example

```ts
import { escapeStringRegexp } from '@ntnyq/utils'

const result = escapeStringRegexp('hello.world?')
console.log(result) // => 'hello\\.world\\?'
```

---

## countGraphemes

Counts graphemes in a given string.

### Parameters

- **value**: A string to count graphemes.

### Returns

The number of graphemes in `value`.

### Example

```ts
import { countGraphemes } from '@ntnyq/utils'

const result = countGraphemes('👋🌍')
console.log(result) // => 2
```

---

## calculateNGramSimilarity

Calculates the n-gram similarity score between two strings.

### Parameters

- **str1**: The first string to compare.
- **str2**: The second string to compare.
- **options**: Options for controlling comparison behavior. `sliceLength` must
  be a positive integer.

### Returns

A similarity score between 0 and 1.

### Example

```ts
import { calculateNGramSimilarity } from '@ntnyq/utils'

const result = calculateNGramSimilarity('hello', 'hallo')
console.log(result > 0.5) // => true
```

---

## getLetterByIndex

Gets an English letter by its zero-based index, from `0` (`A`) to `25` (`Z`).

### Parameters

- **index**: An integer between `0` and `25`, inclusive.
- **isLowerCase**: Whether to return a lowercase letter. Defaults to `false`.

### Returns

The corresponding uppercase or lowercase English letter.

### Throws

`RangeError` if the index is outside `0–25`, fractional, `NaN`, or infinite.
Indices do not wrap or extend to multiple letters such as `AA`.

### Example

```ts
import { getLetterByIndex } from '@ntnyq/utils'

getLetterByIndex(0) // => 'A'
getLetterByIndex(25) // => 'Z'
getLetterByIndex(0, true) // => 'a'
getLetterByIndex(26) // throws RangeError
```

---

## joinNonEmptyValues

Joins non-empty strings and numbers into a single string. Empty strings,
`null`, and `undefined` are skipped while zero is preserved.

### Parameters

- **array**: An array of strings or numbers.
- **options**: An object of options.

### Returns

A string.

### Example

```ts
import { joinNonEmptyValues } from '@ntnyq/utils'

const result = joinNonEmptyValues(['hello', '', 'world'], { separator: ' ' })
console.log(result) // => 'hello world'
```

---

## randomString

Generates a random string using the provided characters.

### Parameters

- **length**: Non-negative integer output length measured in graphemes.
- **chars**: Graphemes used to generate the output. Must be non-empty when
  `length` is greater than zero.

### Returns

A random string.

### Example

```ts
import { randomString } from '@ntnyq/utils'

const result = randomString(8)
console.log(result.length) // => 8
```

---

## slugify

Converts a string into a URL-friendly slug.

### Parameters

- **str**: The string to convert.

### Returns

A normalized, lowercase slug string.

### Example

```ts
import { slugify } from '@ntnyq/utils'

const result = slugify('Hello, World!')
console.log(result) // => 'hello-world'
```

---

## truncate

Truncates text to a maximum length and appends/prepends a suffix.

### Parameters

- **input**: Source string.
- **options**: Truncation options including `maxLength`, `suffix`, `position`, and `preserveWords`.

### Returns

Truncated string.

### Example

```ts
import { truncate } from '@ntnyq/utils'

const result = truncate('The quick brown fox', { maxLength: 10 })
console.log(result) // => 'The qui...'
```

---

## unindent

Removes the common leading whitespace from a template string or plain string. Empty lines at the beginning and end of the template string are also removed.

### Parameters

- **input**: The template string or string value to normalize.

### Returns

The unindented string.

### Example

```ts
import { unindent } from '@ntnyq/utils'

const str = unindent`
  if (foo) {
    bar()
  }
`

console.log(str)
```

---

## SPECIAL_CHAR

A stable collection of commonly reused string characters. It lives with the
string module instead of a global constants bucket.

```ts
import { SPECIAL_CHAR } from '@ntnyq/utils'

SPECIAL_CHAR.hyphen // => '-'
```
