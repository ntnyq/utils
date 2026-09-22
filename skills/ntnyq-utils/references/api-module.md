# Module

Source: `docs/api/module.md`, `src/module/interopDefault.ts`,
`tests/module.test.ts`.

```ts
import { interopDefault } from '@ntnyq/utils'

const value = await interopDefault(Promise.resolve({ default: 0 })) // 0
const named = await interopDefault({ name: 'utils' }) // { name: 'utils' }
```

`interopDefault(moduleOrPromise)` always returns a promise. After awaiting the
input, it unwraps an own `default` property if present, preserving falsy values
such as `0`, `false`, `''`, null, and undefined. Otherwise it returns the
resolved module itself. Use it when adapting mixed module export shapes;
ordinary named ESM imports do not need this helper.
