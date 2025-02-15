import { defineConfig } from 'vitest/config'
import type { UserConfigExport } from 'vitest/config'

const config: UserConfigExport = defineConfig({
  test: {
    reporters: ['dot'],
    coverage: {
      include: ['**/src/**/*.ts'],
      reporter: ['lcov', 'text'],
    },
  },
})

export default config
