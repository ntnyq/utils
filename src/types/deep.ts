import type { Primitive } from './base'

export type DeepRequired<T> = T extends Primitive
  ? NonNullable<T>
  : T extends readonly unknown[]
    ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
    : { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
