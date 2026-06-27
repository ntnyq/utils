import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: {
    tsgo: true,
  },
  entry: ['src/index.ts'],
  platform: 'neutral',
  target: ['node22', 'es2023'],
})
