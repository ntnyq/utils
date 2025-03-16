// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  antfu: {
    overrides: {
      'antfu/top-level-function': 'error',
    },
  },
  typescript: {
    allowDefaultProject: ['tsup.config.ts', 'vitest.config.ts'],
    tsconfigPath: './tsconfig.json',
  },
})
