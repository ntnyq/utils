/// <reference lib="esnext.disposable" />

import { build, Rolldown } from 'tsdown'
import { beforeAll, describe, expect, it } from 'vitest'

async function bundleConsumer(
  importName: string,
  moduleId: string,
  libraryCode?: string,
): Promise<string> {
  const bundle = await Rolldown.rolldown({
    input: 'virtual:consumer',
    plugins: [
      {
        name: 'treeshake-consumer',
        resolveId(id) {
          if (id === 'virtual:consumer' || id === 'virtual:library') {
            return id
          }
          return undefined
        },
        load(id) {
          if (id === 'virtual:consumer') {
            return `export { ${importName} } from ${JSON.stringify(moduleId)}`
          }
          if (id === 'virtual:library') {
            return libraryCode
          }
          return undefined
        },
      },
    ],
  })

  try {
    const { output } = await bundle.generate({ format: 'esm', minify: true })
    const chunk = output.find(entry => entry.type === 'chunk')
    if (!chunk) {
      throw new Error('Expected a consumer bundle')
    }
    return chunk.code
  } finally {
    await bundle.close()
  }
}

describe('package tree shaking', () => {
  let libraryCode: string

  beforeAll(async () => {
    const handle = await build({
      config: 'tsdown.config.ts',
      clean: false,
      write: false,
      dts: false,
      logLevel: 'silent',
    })

    try {
      const chunk = handle.bundles
        .flatMap(bundle => bundle.chunks)
        .find(entry => entry.type === 'chunk')
      if (!chunk) {
        throw new Error('Expected a library bundle')
      }
      libraryCode = chunk.code
    } finally {
      await Promise.all(
        handle.bundles.map(bundle => bundle[Symbol.asyncDispose]()),
      )
    }
  })

  it.each([
    { importName: 'ensurePrefix', modulePath: './src/string/ensurePrefix.ts' },
    { importName: 'NOOP', modulePath: './src/function/noop.ts' },
    {
      importName: 'SPECIAL_CHAR',
      modulePath: './src/string/specialCharacters.ts',
    },
  ])(
    'should retain only the dependencies of $importName',
    async ({ importName, modulePath }) => {
      const fromPackage = await bundleConsumer(
        importName,
        'virtual:library',
        libraryCode,
      )
      const fromModule = await bundleConsumer(importName, modulePath)

      expect(fromPackage).toBe(fromModule)
    },
  )
})
