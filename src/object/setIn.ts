import type { PathInput, PathSegment } from './getIn'

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
export function setIn<T extends object, V>(
  target: T,
  path: PathInput,
  value: V,
  options: SetInOptions = {},
): T {
  const { separator = '.', createIntermediate = true, mutate = false } = options

  const segments = normalizePath(path, separator)
  if (segments.length === 0) {
    return target
  }

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

    if (
      !createIntermediate &&
      (sourceNext === undefined || sourceNext === null)
    ) {
      return target
    }

    const clonedNext = cloneContainer(sourceNext, nextKey)
    current[key] = clonedNext
    current = clonedNext as Record<PathSegment, unknown>
    sourceCurrent = sourceNext
  }

  return root as T
}
