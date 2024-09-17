export type Nullable<T> = T | null
export type MayBe<T> = T | undefined

export type AnyFn<T = any, R = any> = (...args: T[]) => R

export type Arrayable<T> = T | T[]
export type Awaitable<T> = T | Promise<T>

export type Prettify<T> = Omit<T, never>
