/**
 * Overwrite some keys
 *
 * @example
 *
 * ```typescript
 * type A = { a: string, b: number }
 * type B = { b: number }
 *
 * type C = Overwrite<A, B>
 *
 * // C is { a: string, b: number }
 * ```
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

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
