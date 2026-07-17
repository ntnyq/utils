/**
 * A function that does nothing.
 * @returns Nothing.
 *
 * @example
 *
 * ```typescript
 * import { noop } from '@ntnyq/utils'
 *
 * noop() // does nothing
 * ```
 */
// oxlint-disable-next-line no-empty-function
export function noop(): void {}

/**
 * Alias of {@link noop}.
 *
 * @example
 *
 * ```typescript
 * import { NOOP } from '@ntnyq/utils'
 *
 * NOOP() // does nothing
 * ```
 */
export const NOOP: typeof noop = noop
