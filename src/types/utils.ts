/**
 * A literal type that supports custom further strings but preserves autocompletion in IDEs.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609}
 */
export type LiteralUnion<Union extends Base, Base = string> =
  | Union
  | (Base & { zz_IGNORE_ME?: never })

/**
 * @see {@link TODO:}
 */
export type Merge<T, U> = keyof T & keyof U extends never
  ? T & U
  : Omit<T, keyof T & keyof U> & U

/**
 * Non empty object `{}`
 */
export type NonEmptyObject<T> = T extends Record<string, never> ? never : T

/**
 * A type that represents the values of an object type.
 */
export type ValueOf<T> = T[keyof T]
