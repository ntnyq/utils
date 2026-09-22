# @ntnyq/utils

[![CI](https://github.com/ntnyq/utils/workflows/CI/badge.svg)](https://github.com/ntnyq/utils/actions)
[![NPM VERSION](https://img.shields.io/npm/v/@ntnyq/utils.svg)](https://www.npmjs.com/package/@ntnyq/utils)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/@ntnyq/utils.svg)](https://www.npmjs.com/package/@ntnyq/utils)
[![LICENSE](https://img.shields.io/github/license/ntnyq/utils.svg)](https://github.com/ntnyq/utils/blob/main/LICENSE)

> Common used utils.

## Install

```shell
npm install @ntnyq/utils
```

```shell
yarn add @ntnyq/utils
```

```shell
pnpm add @ntnyq/utils
```

## Agent Skills

This repository provides the [ntnyq-utils skill](./skills/ntnyq-utils/SKILL.md)
for AI coding agents, with API guidance, examples, and compatibility notes
across 18 utility categories.

Install it from your project directory using the
[`skills` CLI](https://github.com/vercel-labs/skills):

```shell
npx skills add ntnyq/utils --skill ntnyq-utils
```

To install it specifically for Codex:

```shell
npx skills add ntnyq/utils --skill ntnyq-utils --agent codex
```

Add `--global` to make it available across projects:

```shell
npx skills add ntnyq/utils --skill ntnyq-utils --global
```

Use this skill when the target project declares `@ntnyq/utils` as a dependency,
or when you explicitly ask the agent to install, use, or migrate to it. In a
monorepo, this applies to the target workspace package. Installing the skill
does not install the `@ntnyq/utils` package itself.

See [skills/GENERATION.md](./skills/GENERATION.md) for the skill's sources and
maintenance workflow.

## Credits

- [antfu/utils](https://github.com/antfu/utils)

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
