export type AnyFn<T = any, R = any> = (...args: T[]) => R

export type Arrayable<T> = T | T[]
export type Awaitable<T> = Promise<T> | T
export type Callable<T> = AnyFn<any, T> | T

export type MayBe<T> = T | undefined

export type Nullable<T> = T | null

/**
 * Overwrite some keys type
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

/**
 * Prettify object type
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
export type PrettifyV2<T> = Omit<T, never>

export type PrimitiveType =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | null
  | undefined

/**
 * Resolve `boolean | Record<string, any>` to `Record<string, any>`
 */
export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export * from './json'
export * from './utils'
export * from './module'
