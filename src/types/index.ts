export type AnyFn<T = any, R = any> = (...args: T[]) => R

export type Arrayable<T> = T | T[]
export type Awaitable<T> = Promise<T> | T

export type MayBe<T> = T | undefined
export type Nullable<T> = null | T

export type PrimitiveType = bigint | boolean | null | number | string | symbol | undefined

/**
 * Prettify object type
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
export type PrettifyV2<T> = Omit<T, never>

/**
 * Overwrite some keys type
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

/**
 * Resolve `boolean | Record<string, any>` to `Record<string, any>`
 */
export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export * from './module'
