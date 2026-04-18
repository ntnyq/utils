import {
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isNaN,
  isNull,
  isRecord,
  isUndefined,
  isZero,
} from '../is'

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
   * clean empty object
   *
   * @default false
   */
  cleanEmptyObject?: boolean

  /**
   * recursive clean object
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
    (options.cleanEmptyObject && isEmptyObject(value))
  )
}

/**
 * clean undefined, null, zero, empty string, empty array, empty object from object
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

  const result = obj as Record<string, unknown>

  for (const key of Object.keys(result)) {
    const value = result[key]

    if (shouldCleanValue(value, resolvedOptions)) {
      delete result[key]
    } else if (resolvedOptions.recursive && isRecord(value)) {
      const cleanedValue = cleanObject(value, resolvedOptions)
      result[key] = cleanedValue

      if (resolvedOptions.cleanEmptyObject && isEmptyObject(cleanedValue)) {
        delete result[key]
      }
    }
  }

  return obj as T
}
