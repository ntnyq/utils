import type { Prettify } from './base'

/**
 * Overwrite some keys or append new keys
 *
 * @example
 *
 * ```typescript
 * type A = { a: string, b: number }
 * type B = { b?: boolean, c: string }
 *
 * type C = Overwrite<A, B>
 *
 * // C is { a: string, b?: boolean, c: string }
 * ```
 */
export type Overwrite<T, U> = Prettify<Omit<T, keyof U> & U>

/**
 * Overwrite some keys or append new keys, but only if the keys in U are already present in T
 *
 * @example
 *
 * ```typescript
 * type A = { a: string, b: number }
 * type B = { b: boolean }
 *
 * type C = StrictOverwrite<A, B>
 *
 * // C is { a: string, b: boolean }
 * ```
 */
export type StrictOverwrite<T, U> =
  Exclude<keyof U, keyof T> extends never
    ? Prettify<Omit<T, keyof U> & U>
    : never

/**
 * Exclude some keys
 *
 * @example
 *
 * ```typescript
 * type A = { a: string, b: number }
 * type B = { b: number }
 *
 * type C = Without<A, B>
 *
 * // C is { a: string }
 * ```
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * Exclusive or
 *
 * @example
 *
 * ```typescript
 * type A = { a: string }
 * type B = { b: number }
 *
 * type C = Exclusive<A, B>
 *
 * // C is either A or B, but not both
 * ```
 */
export type Exclusive<T, U> = (T & Without<U, T>) | (U & Without<T, U>)
