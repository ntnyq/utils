import {
  isEmptyArray,
  isEmptyString,
  isNaN,
  isNull,
  isRecord,
  isUndefined,
  isZero,
} from '../predicate'
import { cloneDeepInternal } from './cloneDeepInternal'
import { isPlainObject } from './isPlainObject'

type CleanObjectValue<Value> = Value extends readonly unknown[]
  ? Value
  : Value extends object
    ? CleanObjectResult<Value>
    : Value

export type CleanObjectResult<T extends object> = {
  [Key in keyof T]?: CleanObjectValue<T[Key]>
}

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

function cleanRecordInPlace(
  object: Record<string, unknown>,
  options: Required<CleanObjectOptions>,
  seen: WeakSet<object>,
  source?: Record<string, unknown>,
): void {
  if (object === source || seen.has(object)) {
    return
  }
  seen.add(object)

  for (const key of Object.keys(object)) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key)
    if (descriptor && 'value' in descriptor) {
      const value: unknown = descriptor.value

      if (shouldCleanValue(value, options)) {
        delete object[key]
      } else if (options.recursive && isRecord(value)) {
        const sourceValue: unknown = source
          ? Object.getOwnPropertyDescriptor(source, key)?.value
          : undefined
        cleanRecordInPlace(
          value,
          options,
          seen,
          isRecord(sourceValue) ? sourceValue : undefined,
        )

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
}

/**
 * Creates a deep-cloned object without the selected empty values.
 * Accessors are preserved without invocation. Values retained by identity
 * during cloning are not recursively cleaned.
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
): CleanObjectResult<T> {
  if (!isRecord(obj)) {
    return {} as CleanObjectResult<T>
  }

  const cloned = cloneDeepInternal(obj, new WeakMap(), {
    descriptorsConfigurable: true,
  })
  return cleanObjectWithOptions(cloned, options, obj)
}

/**
 * Cleans selected empty values from an object in place.
 * @param obj - Object to mutate.
 * @param options - Clean options.
 * @returns The source object after cleaning.
 */
export function cleanObjectInPlace<T extends object>(
  obj?: T | undefined | null,
  options: CleanObjectOptions = {},
): CleanObjectResult<T> {
  return cleanObjectWithOptions(obj, options)
}

function cleanObjectWithOptions<T extends object>(
  obj: T | undefined | null,
  options: CleanObjectOptions,
  source?: Record<string, unknown>,
): CleanObjectResult<T> {
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
    return {} as CleanObjectResult<T>
  }

  cleanRecordInPlace(
    obj as Record<string, unknown>,
    resolvedOptions,
    new WeakSet(),
    source,
  )

  return obj as CleanObjectResult<T>
}
