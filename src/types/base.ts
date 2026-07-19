export type AnyFn<R = any, T = any> = (...args: T[]) => R

export type Arrayable<T> = T | T[]

export type Awaitable<T> = Promise<T> | T

export type Callable<T> = AnyFn<T> | T

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

/**
 * Extracts the keys whose values can be used as property keys.
 *
 * @example
 *
 * ```typescript
 * interface Item {
 *   id: number
 *   name: string
 *   active: boolean
 *   metadata: object
 * }
 *
 * type ItemPropertyKey = PropertyKeyOf<Item>
 *
 * // ItemPropertyKey is 'id' | 'name'
 * ```
 */
export type PropertyKeyOf<T> = {
  [K in keyof T]-?: T[K] extends PropertyKey ? K : never
}[keyof T]
