# Web

Source: `docs/api/web.md`, `src/web/`, `tests/web.test.ts`,
`tests/web-environment.test.ts`, and `tests/web-file.test.ts`.

## Environment and DOM

- `isBrowser()` checks DOM global availability at call time.
- `isHTMLElement(value)` is safe when DOM globals are absent.
- `isElementVisibleInViewport(element, targetWindow?)` checks intersection with
  the viewport, not full visibility or CSS visibility. Without a window it
  returns false.
- `scrollElementIntoView(element, options)` forwards standard scrolling
  options. With a custom `parent`, it scrolls only when the element falls
  outside that parent's horizontal or vertical bounds. The default
  `document.body` parent always delegates to native `scrollIntoView`.
- `openExternalURL(url, options)` accepts `target` (default `'_blank'`) and
  `allowedProtocols` (default HTTP/HTTPS). Disallowed protocols throw.
  New browsing contexts use `noopener,noreferrer`; it returns a window proxy
  or null. There is no arbitrary window-features option.

```ts
import { isBrowser, loadImageDimensions, requestFrame } from '@ntnyq/utils'

if (isBrowser()) {
  requestFrame(() => console.log('next frame'))
  const size = await loadImageDimensions('/logo.png')
  console.log(size.width, size.height)
}
```

`getGlobalRoot()` returns the browser window or `globalThis`. `requestFrame`
and `cancelFrame` call that root's native animation-frame methods with the
correct receiver. They require those methods to exist and have no timer fallback.

## Image Dimensions

`loadImageDimensions(source, options)` accepts a URL string, Blob, or File and
returns a promise of `{ width, height }` using natural image dimensions.
It requires browser image APIs. Defaults:

| Option        | Default       | Purpose                                                                    |
| ------------- | ------------- | -------------------------------------------------------------------------- |
| `timeout`     | `30000`       | Milliseconds until load rejection                                          |
| `decoding`    | `'async'`     | Browser decoding hint                                                      |
| `crossOrigin` | `'anonymous'` | CORS mode; also accepts `'use-credentials'` or null                        |
| `cache`       | `true`        | Reuse successful loads; false adds a cache-busting query to string sources |

Blob object URLs are cleaned up after loading. Failed loads are removed from
the cache so a later call can retry.

## File Validation

```ts
import { convertToBytes, validateFile } from '@ntnyq/utils'

const file = new File(['example'], 'notes.txt', { type: 'text/plain' })
const result = validateFile(file, {
  allowedExtensions: ['txt'],
  allowedMimeTypes: ['text/*'],
  maxSize: convertToBytes(2, 'MB'),
})
if (!result.isValid) {
  console.log(result.issues)
}
```

The result contains `{ file, isValid, issues }`. Size bounds are inclusive
bytes; allowed MIME types support wildcards. Extensions are case-insensitive
and may have a leading dot. Empty allowlists impose no restriction.
Ordinary invalid files return issues with codes `file-too-large`,
`file-too-small`, `invalid-extension`, and `invalid-mime-type`.

Set `stopAtFirstIssue: true` for early exit. Custom synchronous `rules` return
an issue or a nullish value. Invalid size configuration throws; this is a
metadata check, not a file-content inspection.
