# Skills Generation Information

This document records the source snapshot and maintenance process for the
`ntnyq-utils` skill. Its structure follows the table-based entry point and
topic references used by [Slidev's skills](https://github.com/slidevjs/slidev/tree/main/skills)
and its [generation record](https://github.com/slidevjs/slidev/blob/main/skills/GENERATION.md).
The content is specific to this repository and was synthesized from its
documentation, public exports, implementation, and tests.

## Source Snapshot

| Field               | Value                                      |
| ------------------- | ------------------------------------------ |
| Package             | `@ntnyq/utils`                             |
| Package version     | `0.23.0`                                   |
| Source commit       | `b07a60eca1179f2647a0bdcc578cc32df98205ba` |
| Short SHA           | `b07a60e`                                  |
| Commit date         | `2026-09-20 10:40:15 +0800`                |
| Commit subject      | `chore: release v0.23.0`                   |
| Generation date     | `2026-09-22`                               |
| Source working tree | Clean before skill generation              |

The SHA identifies the source that was reviewed, not the later commit that
adds or updates the generated skill. There is no automatic generation script;
updates require reviewing the changed contracts and editing the relevant pages.

## Layout

```text
skills/
├── GENERATION.md
└── ntnyq-utils/
    ├── SKILL.md
    └── references/
        └── api-<category>.md
```

`SKILL.md` contains discovery metadata, a quick start, a task-to-reference
table, and cross-category compatibility rules. The 18 `api-*` references map
to the 18 source categories. Keep detailed semantics in those references so
agents can load only what a task needs. Files use lowercase kebab-case names.

## Source Mapping

Shared sources are `README.md`, `package.json`, `src/index.ts`,
`docs/guide/getting-started.md`, and `docs/api/index.md`.
Each category reference uses `docs/api/<category>.md`, the corresponding
`src/<category>/` directory, and the tests below. These paths are relative to
the repository root.

| Reference                                                | Category    | Primary tests                                                                  |
| -------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| [api-array](ntnyq-utils/references/api-array.md)         | `array`     | `tests/array.test.ts`                                                          |
| [api-async](ntnyq-utils/references/api-async.md)         | `async`     | `tests/async.test.ts`                                                          |
| [api-color](ntnyq-utils/references/api-color.md)         | `color`     | `tests/color.test.ts`                                                          |
| [api-function](ntnyq-utils/references/api-function.md)   | `function`  | `tests/function.test.ts`                                                       |
| [api-html](ntnyq-utils/references/api-html.md)           | `html`      | `tests/html.test.ts`                                                           |
| [api-json](ntnyq-utils/references/api-json.md)           | `json`      | `tests/json.test.ts`                                                           |
| [api-logging](ntnyq-utils/references/api-logging.md)     | `logging`   | `tests/logging.test.ts`                                                        |
| [api-module](ntnyq-utils/references/api-module.md)       | `module`    | `tests/module.test.ts`                                                         |
| [api-number](ntnyq-utils/references/api-number.md)       | `number`    | `tests/number.test.ts`                                                         |
| [api-object](ntnyq-utils/references/api-object.md)       | `object`    | `tests/object.test.ts`                                                         |
| [api-path](ntnyq-utils/references/api-path.md)           | `path`      | `tests/path.test.ts`                                                           |
| [api-predicate](ntnyq-utils/references/api-predicate.md) | `predicate` | `tests/predicate.test.ts`                                                      |
| [api-proxy](ntnyq-utils/references/api-proxy.md)         | `proxy`     | `tests/proxy.test.ts`                                                          |
| [api-string](ntnyq-utils/references/api-string.md)       | `string`    | `tests/string.test.ts`                                                         |
| [api-tree](ntnyq-utils/references/api-tree.md)           | `tree`      | `tests/tree.test.ts`, `tests/tree-extended.test.ts`                            |
| [api-types](ntnyq-utils/references/api-types.md)         | `types`     | `tests/types.utils.test.ts`                                                    |
| [api-units](ntnyq-utils/references/api-units.md)         | `units`     | `tests/units.test.ts`                                                          |
| [api-web](ntnyq-utils/references/api-web.md)             | `web`       | `tests/web.test.ts`, `tests/web-environment.test.ts`, `tests/web-file.test.ts` |

Also review `tests/api.test.ts`, `tests/types.api.test.ts`,
`tests/types.admin-api.test.ts`, and `tests/types.general-data-api.test.ts`
for public exports and inferred contracts.

## Generation Decisions

1. Inventory the package export map and category barrels before documenting
   imports. The root entry is the public API; category subpaths are not exported.
2. Read category documentation and verify non-obvious behavior against source
   and regression tests. Source contracts take precedence over stale prose.
   For example, `isEmptyObject` does not imply a plain object, and
   `flattenTree` does not expose the other traversal helpers' cycle option.
3. Rewrite material as operation choices, defaults, return shapes, mutation
   behavior, and short examples. Avoid copying full API manuals or relying on
   handwritten export counts in documentation.
4. Keep references useful outside this checkout: examples import
   `@ntnyq/utils`, and all essential guidance lives inside `ntnyq-utils/`.
   Source paths identify provenance without requiring the source repository
   for ordinary skill use.
5. Keep generation instructions here, outside the installable skill. Preserve
   the package's English documentation style and exact API spelling.

## Incremental Updates

From the repository root, compare against the recorded source commit:

```bash
git diff --name-only b07a60eca1179f2647a0bdcc578cc32df98205ba..HEAD -- README.md package.json src/ docs/ tests/
git diff b07a60eca1179f2647a0bdcc578cc32df98205ba..HEAD -- package.json src/ docs/ tests/
git log --oneline b07a60eca1179f2647a0bdcc578cc32df98205ba..HEAD -- src/ docs/ tests/
```

Also inspect uncommitted changes when generating from a working tree:

```bash
git status --short
git diff HEAD -- README.md package.json src/ docs/ tests/
```

For each changed category:

1. Read changed docs, signatures, implementations, and relevant tests together.
   Check defaults, errors, mutation, readonly inputs, type inference, and runtime
   requirements rather than updating examples from names alone.
2. Patch only the affected reference and cross-category rules. Add a reference
   and index row for a new category; remove or migrate obsolete exports.
3. Verify code examples, relative links, and public import names. Distinguish
   runtime values from type-only exports. Do not teach internal functions that
   are absent from the public barrels.
4. Run the checks below, then update the snapshot table, skill version note,
   comparison SHA in the commands, and history row. If source changes are
   uncommitted, explicitly record that fact instead of claiming the SHA
   represents them.

## Validation

- Validate `SKILL.md` frontmatter: `name: ntnyq-utils` and a description scoped
  to projects declaring this dependency or users explicitly requesting its
  installation, use, or adoption. Preserve the workspace-specific dependency
  check and the rule against adding the package solely because the skill is
  available. If the skill-creator validator is available, run its
  `scripts/quick_validate.py` against `skills/ntnyq-utils`.
- Confirm every local reference link resolves, every reference has an entry in
  `SKILL.md`, and source mappings still exist.
- Typecheck the TypeScript fences against the current source exports using
  strict compiler settings. Keep any temporary validation files out of commits.
- Verify stated outputs for representative examples. Browser calls need a
  browser or the project's mocks; do not execute network examples blindly.
- Format only the skill files, then run the repository-required checks:

```bash
pnpm exec oxfmt --write skills
pnpm exec oxfmt --check skills
pnpm test
pnpm typecheck
```

Follow the active environment's command-wrapper rules when running these
commands. If source or site files also change, run the additional checks
required for that change, such as `pnpm run release:check` or `pnpm docs:build`.

## History

| Date       | Source SHA | Package version | Change                                                                      |
| ---------- | ---------- | --------------- | --------------------------------------------------------------------------- |
| 2026-09-22 | `b07a60e`  | `0.23.0`        | Initial skill with a task index, compatibility rules, and 18 API references |
