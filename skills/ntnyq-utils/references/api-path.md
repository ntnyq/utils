# Path

Source: `docs/api/path.md`, `src/path/`, `tests/path.test.ts`.

These functions process strings without filesystem I/O.

```ts
import {
  getFileExtension,
  getFileName,
  normalizePathSlashes,
  removeFileExtension,
} from '@ntnyq/utils'

getFileName('/docs/report.pdf?download=1#page2') // 'report.pdf'
getFileName('/docs/report.pdf', { includeExtension: false }) // 'report'
getFileExtension('archive.tar.gz') // 'gz'
removeFileExtension('archive.tar.gz') // 'archive.tar'
normalizePathSlashes('src\\path\\index.ts') // 'src/path/index.ts'
```

`getFileName` recognizes both slash styles and strips query/fragment suffixes.
It returns `''` when there is no filename. `getFileExtension` returns the final
extension without a dot, or `undefined` when absent.

`removeFileExtension` removes only the last extension and preserves standalone
dotfiles such as `.env`. It does not parse URL suffixes; extract the filename
first for URL input. Dotfile semantics differ: `getFileExtension('.env')`
returns `'env'`, while `removeFileExtension('.env')` keeps `'.env'`.

`normalizePathSlashes` replaces backslashes only; it does not resolve `..`,
normalize filesystem paths, or check existence.
