/**
 * interop module
 */
export type InteropModuleDefault<T> = T extends { default: infer U } ? U : T

/**
 * Resolve `boolean | Options` to `Options`
 */
export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>
