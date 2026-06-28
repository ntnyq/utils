export type AnyFn<T = any, R = any> = (...args: T[]) => R

export type Arrayable<T> = T | T[]

export type Awaitable<T> = Promise<T> | T

export type Callable<T> = AnyFn<any, T> | T

export type MayBe<T> = T | undefined

export type Nullable<T> = T | null

/**
 * Prettify object type
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/**
 * Represents all primitive types in TypeScript
 */
export type Primitive =
  | bigint
  | boolean
  | number
  | string
  | symbol
  | AnyFn
  | null
  | undefined
