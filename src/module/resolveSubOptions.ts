import type { ResolvedOptions } from '../types'

/**
 * Resolve sub options `boolean | Options` to `Options`
 * @param options - core options
 * @param key - sub options key
 * @returns resolved sub options
 *
 * @example
 *
 * ```typescript
 * import { resolveSubOptions } from '@ntnyq/utils'
 *
 * interface Options {
 *   compile?: boolean | {
 *     include?: string[]
 *     exclude?: string[]
 *   }
 * }
 *
 * const options: Options = {
 *   compile: true
 * }
 *
 * console.log(resolveSubOptions(options, 'compile'))
 *
 * // => {}
 * ```
 */
export function resolveSubOptions<
  T extends Record<string, any>,
  K extends keyof T,
>(options: T, key: K): Partial<ResolvedOptions<T[K]>> {
  return typeof options[key] === 'boolean' ? {} : options[key] || {}
}
