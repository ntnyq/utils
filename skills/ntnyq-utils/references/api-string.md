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
| `countCodePoints(text)`                   | Counts Unicode code points using string iteration; added after v0.23.0, so check installed exports   |
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

## Counting Text

Use `countCodePoints` for Unicode code points, `countGraphemes` for
user-perceived characters, and `.length` for UTF-16 code units. For example,
`'😀'.length` is 2, while both counting helpers return 1.

```ts
import { countCodePoints, countGraphemes } from '@ntnyq/utils'

countCodePoints('') // 0
countCodePoints('你好😀') // 3
countCodePoints('e\u0301') // 2
countGraphemes('e\u0301') // 1
countCodePoints('🇨🇳') // 2
countGraphemes('🇨🇳') // 1
countCodePoints('👨‍👩‍👧‍👦') // 7
countGraphemes('👨‍👩‍👧‍👦') // 1
```

`countCodePoints` accepts a string without implicit conversion, preserves
whitespace, and performs no Unicode normalization. Combining marks and joined
emoji count separately; each unpaired UTF-16 surrogate counts as one. It does
not require `Intl.Segmenter`.

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
