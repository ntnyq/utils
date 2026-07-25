import type { PathInput, PathSegment } from './getIn'

type DecimalDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type IsDecimalDigits<Value extends string> = Value extends ''
  ? false
  : Value extends `${DecimalDigit}${infer Rest}`
    ? Rest extends ''
      ? true
      : IsDecimalDigits<Rest>
    : false

type NormalizeStringSegment<Value extends string> =
  IsDecimalDigits<Value> extends true
    ? Value extends `${infer NumericValue extends number}`
      ? NumericValue
      : number
    : Value

type SplitStringPath<
  Path extends string,
  Separator extends string,
  Segments extends readonly PathSegment[] = [],
> = Path extends `${infer Head}${Separator}${infer Tail}`
  ? SplitStringPath<
      Tail,
      Separator,
      Head extends '' ? Segments : [...Segments, NormalizeStringSegment<Head>]
    >
  : Path extends ''
    ? Segments
    : [...Segments, NormalizeStringSegment<Path>]

type PathValueAt<T, Key extends PathSegment> = Key extends keyof T
  ? T[Key]
  : Key extends number
    ? T extends readonly (infer Item)[]
      ? Item
      : unknown
    : unknown

type SetArrayItem<
  Items extends readonly unknown[],
  Index extends number,
  Value,
> = number extends Items['length']
  ? Items extends unknown[]
    ? (Items[number] | Value)[]
    : readonly (Items[number] | Value)[]
  : {
      [Key in keyof Items]: Key extends `${Index}` ? Value : Items[Key]
    }

type SetObjectProperty<
  T,
  Key extends PathSegment,
  Value,
> = T extends readonly unknown[]
  ? Key extends number
    ? SetArrayItem<T, Key, Value>
    : T & { [Property in Key]: Value }
  : T extends object
    ? Simplify<Omit<T, Extract<keyof T, Key>> & { [Property in Key]: Value }>
    : { [Property in Key]: Value }

type Simplify<T> = { [Key in keyof T]: T[Key] }

type SetPathValue<
  T,
  Path extends readonly PathSegment[],
  Value,
> = Path extends readonly [
  infer Head extends PathSegment,
  ...infer Tail extends readonly PathSegment[],
]
  ? SetObjectProperty<
      T,
      Head,
      Tail extends readonly []
        ? Value
        : SetPathValue<PathValueAt<T, Head>, Tail, Value>
    >
  : T

type ResolveSetInSeparator<Options extends SetInOptions> = Options extends {
  separator: infer Separator
}
  ? Separator extends string
    ? Separator
    : '.'
  : 'separator' extends keyof Options
    ? string
    : '.'

export type SetInResult<
  T extends object,
  Path extends PathInput,
  Value,
  Separator extends string = '.',
> = Path extends string
  ? string extends Path
    ? object
    : string extends Separator
      ? object
      : Separator extends ''
        ? object
        : SetPathValue<T, SplitStringPath<Path, Separator>, Value>
  : Path extends readonly PathSegment[]
    ? number extends Path['length']
      ? object
      : SetPathValue<T, Path, Value>
    : object

type SetInReturn<
  T extends object,
  Path extends PathInput,
  Value,
  Options extends SetInOptions,
> = Options extends { createIntermediate: false }
  ? T | SetInResult<T, Path, Value, ResolveSetInSeparator<Options>>
  : SetInResult<T, Path, Value, ResolveSetInSeparator<Options>>

export interface SetInOptions {
  /**
   * String path separator.
   *
   * @default '.'
   */
  separator?: string

  /**
   * Whether to create missing intermediate containers.
   *
   * @default true
   */
  createIntermediate?: boolean

  /**
   * Whether to mutate the original object.
   *
   * @default false
   */
  mutate?: boolean
}

function normalizePath(path: PathInput, separator: string): PathSegment[] {
  if (typeof path !== 'string') {
    return [...path]
  }

  if (!path) {
    return []
  }

  return path
    .split(separator)
    .filter(Boolean)
    .map(segment => (/^\d+$/u.test(segment) ? Number(segment) : segment))
}

const UNSAFE_PATH_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

function assertSafePath(segments: readonly PathSegment[]): void {
  const unsafeSegment = segments.find(
    segment => typeof segment === 'string' && UNSAFE_PATH_SEGMENTS.has(segment),
  )

  if (unsafeSegment !== undefined) {
    throw new TypeError(`Unsafe path segment: ${String(unsafeSegment)}`)
  }
}

function createContainer(nextKey: PathSegment | undefined): unknown {
  return typeof nextKey === 'number' ? [] : {}
}

function isObjectLike(value: unknown): value is Record<PathSegment, unknown> {
  return typeof value === 'object' && value !== null
}

function cloneContainer(
  value: unknown,
  nextKey: PathSegment | undefined,
): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (isObjectLike(value)) {
    return { ...value }
  }

  return createContainer(nextKey)
}

/**
 * Sets a nested value by path.
 * @param target - Source object.
 * @param path - Dot-path string or path segments.
 * @param value - Value to set.
 * @param options - Set options.
 * @returns Updated object.
 *
 * @example
 *
 * ```typescript
 * import { setIn } from '@ntnyq/utils'
 *
 * const result = setIn({ user: {} }, 'user.profile.name', 'Alice')
 * console.log(result.user.profile.name) // => 'Alice'
 * ```
 */
export function setIn<
  T extends object,
  const Path extends PathInput,
  Value,
  const Options extends SetInOptions = {},
>(
  target: T,
  path: Path,
  value: Value,
  options?: Options,
): SetInReturn<T, Path, Value, Options>

export function setIn<T extends object, Value>(
  target: T,
  path: PathInput,
  value: Value,
  options: SetInOptions = {},
): object {
  const { separator = '.', createIntermediate = true, mutate = false } = options

  const segments = normalizePath(path, separator)
  if (segments.length === 0) {
    return target
  }
  assertSafePath(segments)

  if (mutate) {
    let current: Record<PathSegment, unknown> = target as Record<
      PathSegment,
      unknown
    >

    for (let index = 0; index < segments.length; index++) {
      const key = segments[index]!
      const isLast = index === segments.length - 1

      if (isLast) {
        current[key] = value
        return target
      }

      const nextKey = segments[index + 1]
      const nextValue = current[key]

      if (!isObjectLike(nextValue) && !Array.isArray(nextValue)) {
        if (!createIntermediate) {
          return target
        }
        current[key] = createContainer(nextKey)
      }

      current = current[key] as Record<PathSegment, unknown>
    }

    return target
  }

  const root = cloneContainer(target, segments[0]) as Record<
    PathSegment,
    unknown
  >
  let current: Record<PathSegment, unknown> = root
  let sourceCurrent: unknown = target

  for (let index = 0; index < segments.length; index++) {
    const key = segments[index]!
    const isLast = index === segments.length - 1

    if (isLast) {
      current[key] = value
      return root as T
    }

    const nextKey = segments[index + 1]
    const sourceNext =
      isObjectLike(sourceCurrent) || Array.isArray(sourceCurrent)
        ? (sourceCurrent as Record<PathSegment, unknown>)[key]
        : undefined

    if (!createIntermediate && !isObjectLike(sourceNext)) {
      return target
    }

    const clonedNext = cloneContainer(sourceNext, nextKey)
    current[key] = clonedNext
    current = clonedNext as Record<PathSegment, unknown>
    sourceCurrent = sourceNext
  }

  return root as T
}
