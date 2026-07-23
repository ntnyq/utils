import {
  isEmptyArray,
  isEmptyString,
  isNaN,
  isNull,
  isRecord,
  isUndefined,
  isZero,
} from '../predicate'
import { isPlainObject } from './isPlainObject'

export interface CleanObjectOptions {
  /**
   * clean undefined
   *
   * @default true
   */
  cleanUndefined?: boolean

  /**
   * clean null
   *
   * @default true
   */
  cleanNull?: boolean

  /**
   * clean zero
   *
   * @default false
   */
  cleanZero?: boolean

  /**
   * clean NaN
   *
   * @default true
   */
  cleanNaN?: boolean

  /**
   * clean empty string
   *
   * @default false
   */
  cleanEmptyString?: boolean

  /**
   * clean empty array
   *
   * @default false
   */
  cleanEmptyArray?: boolean

  /**
   * clean plain objects without own keys
   *
   * @default false
   */
  cleanEmptyObject?: boolean

  /**
   * recursively clean nested records while preserving circular references
   *
   * @default true
   */
  recursive?: boolean
}

function shouldCleanValue(
  value: unknown,
  options: Required<CleanObjectOptions>,
): boolean {
  return (
    (options.cleanUndefined && isUndefined(value)) ||
    (options.cleanNull && isNull(value)) ||
    (options.cleanZero && isZero(value)) ||
    (options.cleanNaN && isNaN(value)) ||
    (options.cleanEmptyString && isEmptyString(value)) ||
    (options.cleanEmptyArray && isEmptyArray(value)) ||
    (options.cleanEmptyObject &&
      isPlainObject(value) &&
      Reflect.ownKeys(value).length === 0)
  )
}

function cleanObjectInPlace(
  object: Record<string, unknown>,
  options: Required<CleanObjectOptions>,
  seen: WeakSet<object>,
): void {
  if (seen.has(object)) {
    return
  }
  seen.add(object)

  for (const key of Object.keys(object)) {
    const value = object[key]

    if (shouldCleanValue(value, options)) {
      delete object[key]
    } else if (options.recursive && isRecord(value)) {
      cleanObjectInPlace(value, options, seen)

      if (
        options.cleanEmptyObject &&
        isPlainObject(value) &&
        Reflect.ownKeys(value).length === 0
      ) {
        delete object[key]
      }
    }
  }
}

/**
 * Cleans selected empty values from an object in place.
 * @param obj - object to be cleaned
 * @param options - clean options
 * @returns cleaned object
 * @example
 *
 * ```typescript
 * import { cleanObject } from '@ntnyq/utils'
 *
 * const result = cleanObject({
 *   name: 'Alice',
 *   age: undefined,
 *   meta: { active: true, note: null },
 * })
 *
 * console.log(result) // => { name: 'Alice', meta: { active: true } }
 * ```
 *
 */
export function cleanObject<T extends object>(
  obj?: T | undefined | null,
  options: CleanObjectOptions = {},
): T {
  const resolvedOptions: Required<CleanObjectOptions> = {
    cleanUndefined: true,
    cleanNull: true,
    cleanNaN: true,
    cleanZero: false,
    cleanEmptyString: false,
    cleanEmptyArray: false,
    cleanEmptyObject: false,
    recursive: true,
    ...options,
  }

  if (!isRecord(obj)) {
    return {} as T
  }

  cleanObjectInPlace(
    obj as Record<string, unknown>,
    resolvedOptions,
    new WeakSet(),
  )

  return obj as T
}
