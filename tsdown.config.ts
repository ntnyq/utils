import { defineConfig } from 'tsdown'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  platform: 'neutral',
  target: ['node20', 'es2023'],
})
