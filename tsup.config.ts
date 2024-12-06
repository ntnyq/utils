import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig({
  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  noExternal: [...Object.keys(pkg.dependencies || {})],
  target: ['node18', 'es2022'],
})
