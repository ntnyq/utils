# String

Source: `docs/api/string.md`, `src/string/`, `tests/string.test.ts`.

| API                                       | Use and important behavior                                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ensurePrefix(input, prefix)`             | Prefix only when missing; input comes first                                                          |
| `ensureSuffix(input, suffix)`             | Suffix only when missing                                                                             |
| `joinNonEmptyValues(values, options)`     | Skips `''`, `null`, and `undefined`; preserves `0`; configure `separator`                            |
| `slugify(text)`                           | Normalizes accents, lowercases, joins separators with hyphens, and prefixes a leading digit with `_` |
| `escapeStringRegexp(text)`                | Escapes text for literal matching in a regular expression                                            |
| `unindent`                                | Plain string or tagged template; removes common indentation and outer empty lines                    |
| `createPadString({ length, char })`       | Returns a left-padding function; long inputs are sliced to their final `length` code units           |
| `getLetterByIndex(index, isLowerCase?)`   | Index 0–25 maps to A–Z; invalid indexes throw `RangeError`; no AA or wraparound                      |
| `countGraphemes(text)`                    | Counts user-perceived characters using `Intl.Segmenter` for non-ASCII input                          |
| `randomString(length?, chars?)`           | Defaults to 16 alphanumeric graphemes; uses `Math.random`                                            |
| `calculateNGramSimilarity(a, b, options)` | Score 0–1; defaults to bigrams and case-insensitive comparison                                       |
| `SPECIAL_CHAR`                            | Named reusable characters, for example `.hyphen`                                                     |

`randomString` needs a non-negative safe-integer length and a non-empty alphabet
for non-empty output. Custom alphabets are split into graphemes, so output
JavaScript `.length` can differ from the requested length. It is not a
cryptographic token generator.

`calculateNGramSimilarity` accepts `sliceLength` and `caseSensitive`.
`sliceLength` must be a positive integer; strings shorter than it score zero.

## Truncation

```ts
import { joinNonEmptyValues, truncate } from '@ntnyq/utils'

joinNonEmptyValues(['page', 0, '', null], { separator: '-' }) // 'page-0'
truncate('The quick brown fox', { maxLength: 10 }) // 'The qui...'
truncate('abcdefghij', { maxLength: 7, position: 'middle' }) // 'ab...ij'
```

`truncate` requires `maxLength`, including the suffix length. Defaults are
`suffix: '...'`, `position: 'end'`, and `preserveWords: false`. Position may be
`'start'`, `'middle'`, or `'end'`; word preservation applies to start/end only.
Non-positive lengths return `''`. Truncation uses UTF-16 code units, so it does
not have the grapheme semantics of `countGraphemes`.
