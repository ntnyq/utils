import {
  isEmptyArray,
  isEmptyObject,
  isEmptyString,
  isNull,
  isObject,
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
   * @default true
   */
  cleanEmptyString?: boolean

  /**
   * clean empty array
   *
   * @default true
   */
  cleanEmptyArray?: boolean

  /**
   * clean empty object
   *
   * @default true
   */
  cleanEmptyObject?: boolean

  /**
   * recursive clean object
   *
   * @default true
   */
  recursive?: boolean
}

/**
 * clean undefined, null, zero, empty string, empty array, empty object from object
 * @param obj - object to be cleaned
 * @param options - clean options
 * @returns cleaned object
 */
export function cleanObject<T extends object>(obj: T, options: CleanObjectOptions = {}): T {
  const {
    cleanUndefined = true,
    cleanNull = true,
    cleanZero = false,
    cleanNaN = true,
    cleanEmptyString = true,
    cleanEmptyArray = true,
    cleanEmptyObject = true,
    recursive = true,
  } = options

  Object.keys(obj).forEach(key => {
    const v = obj[key as keyof typeof obj]

    if (cleanUndefined && isUndefined(v)) {
      delete obj[key as keyof typeof obj]
    }
    if (cleanNull && isNull(v)) {
      delete obj[key as keyof typeof obj]
    }
    if (cleanZero && isZero(v)) {
      delete obj[key as keyof typeof obj]
    }
    if (cleanNaN && isZero(v)) {
      delete obj[key as keyof typeof obj]
    }
    if (cleanEmptyString && isEmptyString(v)) {
      delete obj[key as keyof typeof obj]
    }

    if (cleanEmptyArray && isEmptyArray(v)) {
      delete obj[key as keyof typeof obj]
    }

    if (cleanEmptyObject && isEmptyObject(v)) {
      delete obj[key as keyof typeof obj]
    }

    if (recursive && isObject(v)) {
      cleanObject(v, options)
    }
  })

  return obj
}
