# AGENTS

Guidance for AI coding agents working in this repository.

## Scope

- Keep changes focused and minimal.
- Prefer editing existing files over creating new abstractions.
- Do not modify generated output in `dist/` manually.

## Setup And Validation

- Install dependencies: `pnpm install`
- Build library: `pnpm build`
- Run tests: `pnpm test`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Format check: `pnpm format:check`

Use this fast validation order for code changes:

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm lint`

## Tooling Notes

- Package manager: `pnpm` (see `packageManager` in `package.json`).
- Runtime target: Node `^22.13.0 || >=24`.
- Module system: ESM (`"type": "module"`).
- Linting and formatting use Ox tools (`oxlint`, `oxfmt`), not ESLint/Prettier.
- Type declaration generation is handled by `tsdown` with `tsgo`.

## Codebase Map

- Main entry: `src/index.ts` (barrel exports for all utility categories).
- Category modules live under `src/<category>/` with a local `index.ts`.
- Tests live in `tests/*.test.ts`, generally one file per category.
- Docs site lives in `docs/` (VitePress).

## Implementation Conventions

- Follow existing function-first utility style.
- Keep APIs tree-shakable and side-effect free.
- Match existing test style in `tests/*.test.ts`:
  - `describe(<functionName>, ...)`
  - explicit edge-case tests
  - inline snapshots when useful
- Export new public utilities through both:
  - the category `src/<category>/index.ts`
  - root `src/index.ts`

## Documentation Links

- Project overview: [README](README.md)
- Docs home: [docs/index.md](docs/index.md)
- Getting started: [docs/guide/getting-started.md](docs/guide/getting-started.md)
- API index: [docs/api/index.md](docs/api/index.md)

When adding or changing public utilities, update matching API docs in `docs/api/`.

## CI Expectations

CI runs these checks on pull requests and pushes to `main`:

- `pnpm install --frozen-lockfile`
- `pnpm run format:check`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run test`
