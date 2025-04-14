import type { Primitive } from './base'

export type DeepRequired<T> = T extends Primitive
  ? NonNullable<T>
  : {
      [P in keyof T]-?: T[P] extends (infer U)[]
        ? DeepRequired<U>[]
        : T[P] extends readonly (infer V)[]
          ? NonNullable<V>
          : DeepRequired<T[P]>
    }
