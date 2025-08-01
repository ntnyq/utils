# Copilot Instructions for @ntnyq/utils

## Project Overview

This is a TypeScript utility library providing common utilities across categories like array, string, object, DOM, etc. The library follows a modular architecture with strict typing and ESM-only design.

## Architecture Patterns

### Module Organization

- Each category has its own directory (`src/array/`, `src/string/`, etc.) with an `index.ts` that re-exports all functions
- Main `src/index.ts` exports all category modules using `export * from './category'`
- Functions are implemented in separate files named after the function (e.g., `toArray.ts`, `slugify.ts`)

### Type System

- Heavy use of custom utility types from `src/types/` (Arrayable, Nullable, MayBe, Prettify, etc.)
- Type definitions are split across files: `base.ts` (primitives), `deep.ts` (recursive), `json.ts`, etc.
- Functions use precise typing with type guards where applicable

### Function Patterns

- Pure functions with no side effects (`"sideEffects": false` in package.json)
- Consistent JSDoc comments with `@param` and `@returns`
- Type-safe implementations using type predicates (e.g., `value is T[]`)

## Development Workflow

### Build System

- Uses `tsdown` for bundling (configured in `tsdown.config.ts`)
- Targets Node 18+ and ES2022, platform-neutral output
- `pnpm run build` - Production build with types
- `pnpm run dev` - Watch mode for development

### Testing

- Vitest for testing with inline snapshots
- Test files in `tests/` directory match category names (`array.test.ts`, `string.test.ts`)
- Use `expect().toMatchInlineSnapshot()` for complex object outputs

### Code Quality

- ESLint with `@ntnyq/eslint-config` - enforces `antfu/top-level-function` rule
- TypeScript strict mode with `isolatedDeclarations` for type generation
- Prettier with `@ntnyq/prettier-config`

### Release Process

```bash
pnpm run release:check  # lint + typecheck + test
pnpm run release:version  # bumpp for versioning
pnpm run release:publish  # publish to npm
```

## Coding Conventions

### Function Naming

- Use descriptive names: `toArray`, `isElementVisibleInViewport`, `getStringSimilarity`
- Prefix type guards with `is`: `isString`, `isNull`, `isArrayEqual`
- Prefix utility functions with action: `ensure`, `get`, `remove`, `escape`

### File Structure Template

```typescript
import type { Arrayable } from '../types'

/**
 * Function description.
 * @param param - Parameter description.
 * @returns Return value description.
 */
export function functionName<T>(param: Type): ReturnType {
  // Implementation
}
```

### Adding New Utilities

1. Create function file in appropriate category directory
2. Add export to category's `index.ts`
3. Add test cases in corresponding test file
4. Use existing types from `src/types/` when possible

## Key Dependencies

- `tsdown` - Modern TypeScript bundler
- `@ntnyq/eslint-config` - Shared ESLint configuration
- `bumpp` - Version bumping utility
- `vitest` - Testing framework
- Uses pnpm with workspace overrides for `esbuild`

## Notes

- ESM-only package (`"type": "module"`)
- No external runtime dependencies - pure utility library
- Inspired by `antfu/utils` but with custom type system and patterns
