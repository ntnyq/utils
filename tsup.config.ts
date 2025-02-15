import { defineConfig } from 'tsup'

const config: any = defineConfig({
  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: ['node18', 'es2022'],
})

export default config
