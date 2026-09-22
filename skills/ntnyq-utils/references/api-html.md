# HTML

Source: `docs/api/html.md`, `src/html/escape.ts`, `tests/html.test.ts`.

```ts
import { escapeHTML, unescapeHTML } from '@ntnyq/utils'

escapeHTML('<span>A & B</span>') // '&lt;span&gt;A &amp; B&lt;/span&gt;'
unescapeHTML('&lt;span&gt;') // '<span>'
```

`escapeHTML` replaces ampersands, angle brackets, and single/double quotes.
`unescapeHTML` reverses the supported named entities and numeric alternatives
for those characters, including `&apos;`. It is not a complete HTML entity
decoder. Escaping text is not equivalent to sanitizing an HTML document or
validating a URL, CSS, or JavaScript expression.
