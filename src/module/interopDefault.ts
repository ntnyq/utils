import type { Awaitable, InteropModuleDefault } from '../types'

/**
 * Interop default export from a module
 *
 * @param mod - The module
 * @returns The default export
 *
 * @example
 *
 * ```typescript
 * import { interopDefault } from '@ntnyq/utils'
 *
 * const { unindent } = await interopDefault(import('@ntnyq/utils'))
 * ```
 */
export async function interopDefault<T>(
  mod: Awaitable<T>,
): Promise<InteropModuleDefault<T>> {
  const resolved = await mod
  if (
    resolved !== null &&
    resolved !== undefined &&
    Object.hasOwn(resolved, 'default')
  ) {
    return (resolved as unknown as { default: InteropModuleDefault<T> }).default
  }
  return resolved as InteropModuleDefault<T>
}
