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

type DeleteArrayNestedValue<
  Items extends readonly unknown[],
  Index extends number,
  Path extends readonly PathSegment[],
> = number extends Items['length']
  ? Items extends unknown[]
    ? DeletePathValue<Items[number], Path>[]
    : readonly DeletePathValue<Items[number], Path>[]
  : {
      [Key in keyof Items]: Key extends `${Index}`
        ? DeletePathValue<Items[Key], Path>
        : Items[Key]
    }

type DeleteNestedValue<
  T,
  Key extends PathSegment,
  Path extends readonly PathSegment[],
> = T extends readonly unknown[]
  ? Key extends number
    ? DeleteArrayNestedValue<T, Key, Path>
    : T
  : T extends object
    ? {
        [Property in keyof T]: Property extends Key
          ? DeletePathValue<T[Property], Path>
          : T[Property]
      }
    : T

type DeleteProperty<T, Key extends PathSegment> = T extends readonly unknown[]
  ? T
  : T extends object
    ? {
        [
          Property in keyof T as Property extends Key ? never : Property
        ]: T[Property]
      }
    : T

type DeletePathValue<
  T,
  Path extends readonly PathSegment[],
> = Path extends readonly [
  infer Head extends PathSegment,
  ...infer Tail extends readonly PathSegment[],
]
  ? Tail extends readonly []
    ? DeleteProperty<T, Head>
    : DeleteNestedValue<T, Head, Tail>
  : T

type ResolveDeleteInSeparator<Options extends DeleteInOptions> =
  Options extends {
    separator: infer Separator
  }
    ? Separator extends string
      ? Separator
      : '.'
    : 'separator' extends keyof Options
      ? string
      : '.'

export type DeleteInResult<
  T extends object,
  Path extends PathInput,
  Separator extends string = '.',
> = Path extends string
  ? string extends Path
    ? object
    : string extends Separator
      ? object
      : Separator extends ''
        ? object
        : DeletePathValue<T, SplitStringPath<Path, Separator>>
  : Path extends readonly PathSegment[]
    ? number extends Path['length']
      ? object
      : DeletePathValue<T, Path>
    : object

export interface DeleteInOptions {
  /**
   * Whether to mutate the original object.
   *
   * @default false
   */
  mutate?: boolean

  /**
   * String path separator.
   *
   * @default '.'
   */
  separator?: string
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

function isObjectLike(value: unknown): value is Record<PathSegment, unknown> {
  return typeof value === 'object' && value !== null
}

function hasOwnPath(target: object, segments: readonly PathSegment[]): boolean {
  let current: unknown = target

  for (const segment of segments) {
    if (!isObjectLike(current) || !Object.hasOwn(current, segment)) {
      return false
    }
    current = current[segment]
  }

  return true
}

function cloneContainer(value: object): Record<PathSegment, unknown> {
  // `slice` preserves sparse array slots while spread materializes them.
  // oxlint-disable-next-line unicorn/prefer-spread
  return (Array.isArray(value) ? value.slice() : { ...value }) as Record<
    PathSegment,
    unknown
  >
}

/**
 * Deletes a nested own property by path.
 *
 * Immutable mode clones only containers along the deleted path. Deleting an
 * array index preserves the array length and leaves an empty slot.
 *
 * @param target - Source object.
 * @param path - Dot-path string or path segments.
 * @param options - Separator and mutation options.
 * @returns The updated object, or the original object when the path is absent.
 *
 * @example
 *
 * ```typescript
 * import { deleteIn } from '@ntnyq/utils'
 *
 * const source = { user: { name: 'Alice', role: 'admin' } }
 * const result = deleteIn(source, 'user.role')
 * console.log(result) // => { user: { name: 'Alice' } }
 * ```
 */
export function deleteIn<
  T extends object,
  const Path extends PathInput,
  const Options extends DeleteInOptions = {},
>(
  target: T,
  path: Path,
  options?: Options,
): DeleteInResult<T, Path, ResolveDeleteInSeparator<Options>>

export function deleteIn<T extends object>(
  target: T,
  path: PathInput,
  options: DeleteInOptions = {},
): object {
  const { mutate = false, separator = '.' } = options
  const segments = normalizePath(path, separator)

  if (segments.length === 0) {
    return target
  }
  assertSafePath(segments)

  if (!hasOwnPath(target, segments)) {
    return target
  }

  if (mutate) {
    let current = target as Record<PathSegment, unknown>

    for (const [index, key] of segments.entries()) {
      if (index === segments.length - 1) {
        delete current[key]
        return target
      }
      current = current[key] as Record<PathSegment, unknown>
    }
  }

  const root = cloneContainer(target)
  let current = root
  let sourceCurrent = target as Record<PathSegment, unknown>

  for (const [index, key] of segments.entries()) {
    if (index === segments.length - 1) {
      delete current[key]
      return root
    }

    const sourceNext = sourceCurrent[key] as object
    const clonedNext = cloneContainer(sourceNext)
    current[key] = clonedNext
    current = clonedNext
    sourceCurrent = sourceNext as Record<PathSegment, unknown>
  }

  return root
}
