export type PathSegment = string | number | symbol
export type PathInput = string | readonly PathSegment[]

export interface GetInOptions<DefaultValue = undefined> {
  /**
   * Default value returned when path does not exist.
   */
  defaultValue?: DefaultValue

  /**
   * String path separator.
   *
   * @default '.'
   */
  separator?: string
}

export type PathValue<
  T,
  P extends readonly PathSegment[],
> = P extends readonly [infer Head, ...infer Tail]
  ? Head extends keyof T
    ? Tail extends readonly PathSegment[]
      ? PathValue<T[Head], Tail>
      : T[Head]
    : Head extends number
      ? T extends readonly (infer Item)[]
        ? Tail extends readonly PathSegment[]
          ? PathValue<Item, Tail>
          : Item
        : unknown
      : unknown
  : T

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

/**
 * Safely gets a nested value by path.
 * @param target - Source object.
 * @param path - Dot-path string or path segments.
 * @param options - Path options.
 * @returns Nested value or default value when not found.
 *
 * @example
 *
 * ```typescript
 * import { getIn } from '@ntnyq/utils'
 *
 * const result = getIn({ user: { profile: { name: 'A' } } }, 'user.profile.name')
 * console.log(result) // => 'A'
 * ```
 */
export function getIn<T, const P extends readonly PathSegment[]>(
  target: T,
  path: P,
): PathValue<T, P> | undefined

export function getIn<T, const P extends readonly PathSegment[], DefaultValue>(
  target: T,
  path: P,
  options: GetInOptions<DefaultValue>,
): PathValue<T, P> | DefaultValue

export function getIn<T, DefaultValue = undefined>(
  target: T,
  path: string,
  options?: GetInOptions<DefaultValue>,
): unknown | DefaultValue

export function getIn<T, DefaultValue = undefined>(
  target: T,
  path: PathInput,
  options: GetInOptions<DefaultValue> = {},
): unknown | DefaultValue {
  const { defaultValue, separator = '.' } = options
  const segments = normalizePath(path, separator)

  if (segments.length === 0) {
    return target ?? defaultValue
  }

  let current: unknown = target

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return defaultValue as DefaultValue
    }

    if (typeof current !== 'object' && typeof current !== 'function') {
      return defaultValue as DefaultValue
    }

    current = (current as Record<PathSegment, unknown>)[segment]
  }

  return current === undefined ? defaultValue : current
}
