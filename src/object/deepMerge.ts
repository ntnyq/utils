import { isPlainObject } from './isPlainObject'

export interface DeepMergeOptions {
  /**
   * Strategy for merging arrays.
   *
   * - `replace`: use the latest array value.
   * - `concat`: concatenate arrays during merge.
   *
   * @default 'replace'
   */
  arrayStrategy?: 'replace' | 'concat'
}

type AnyRecord = Record<PropertyKey, unknown>

type DeepMergeValue<Left, Right> = Left extends unknown[]
  ? Right extends unknown[]
    ? Right
    : Right
  : Left extends AnyRecord
    ? Right extends AnyRecord
      ? DeepMergeResult<[Left, Right]>
      : Right
    : Right

export type DeepMergeTwo<Left, Right> = Left extends AnyRecord
  ? Right extends AnyRecord
    ? {
        [K in keyof Left | keyof Right]: K extends keyof Right
          ? K extends keyof Left
            ? DeepMergeValue<Left[K], Right[K]>
            : Right[K]
          : K extends keyof Left
            ? Left[K]
            : never
      }
    : Right
  : Right

export type DeepMergeResult<Objects extends readonly unknown[]> =
  Objects extends [infer First, ...infer Rest]
    ? Rest extends readonly unknown[]
      ? DeepMergeTwo<First, DeepMergeResult<Rest>>
      : First
    : {}

function isMergeableRecord(value: unknown): value is AnyRecord {
  return isPlainObject(value)
}

function mergeValue(
  leftValue: unknown,
  rightValue: unknown,
  options: Required<DeepMergeOptions>,
): unknown {
  if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
    if (options.arrayStrategy === 'concat') {
      return [...leftValue, ...rightValue]
    }
    return [...rightValue]
  }

  if (isMergeableRecord(leftValue) && isMergeableRecord(rightValue)) {
    return mergeObjects(leftValue, rightValue, options)
  }

  if (Array.isArray(rightValue)) {
    return [...rightValue]
  }

  if (isMergeableRecord(rightValue)) {
    return mergeObjects({}, rightValue, options)
  }

  return rightValue
}

function mergeObjects(
  left: AnyRecord,
  right: AnyRecord,
  options: Required<DeepMergeOptions>,
): AnyRecord {
  const output: AnyRecord = { ...left }

  for (const key of Reflect.ownKeys(right)) {
    const rightValue = right[key]

    if (key in left) {
      output[key] = mergeValue(left[key], rightValue, options)
    } else {
      output[key] = mergeValue(undefined, rightValue, options)
    }
  }

  return output
}

/**
 * Deeply merges objects into a new object.
 * @param objects - Source objects from left to right.
 * @returns A new merged object.
 *
 * @example
 *
 * ```typescript
 * import { deepMerge } from '@ntnyq/utils'
 *
 * const result = deepMerge(
 *   { theme: { color: 'blue', tags: ['base'] } },
 *   { theme: { color: 'red', tags: ['brand'] } },
 * )
 *
 * console.log(result.theme) // => { color: 'red', tags: ['brand'] }
 * ```
 */
export function deepMerge<const Objects extends readonly AnyRecord[]>(
  ...objects: Objects
): DeepMergeResult<Objects>

/**
 * Deeply merges objects into a new object with custom options.
 * @param options - Merge options.
 * @param objects - Source objects from left to right.
 * @returns A new merged object.
 */
export function deepMerge<const Objects extends readonly AnyRecord[]>(
  options: DeepMergeOptions,
  ...objects: Objects
): DeepMergeResult<Objects>

export function deepMerge<const Objects extends readonly AnyRecord[]>(
  ...args: [DeepMergeOptions, ...Objects] | Objects
): DeepMergeResult<Objects> {
  const isFirstArgOptions = args.length > 0 && isMergeOptions(args[0])

  const [options, objects] = isFirstArgOptions
    ? [
        {
          arrayStrategy: args[0].arrayStrategy ?? 'replace',
        } satisfies Required<DeepMergeOptions>,
        args.slice(1) as unknown as Objects,
      ]
    : [
        {
          arrayStrategy: 'replace',
        } satisfies Required<DeepMergeOptions>,
        args as unknown as Objects,
      ]

  if (objects.length === 0) {
    return {} as DeepMergeResult<Objects>
  }

  const [first, ...rest] = objects
  const base = mergeValue(undefined, first, options) as AnyRecord

  return rest.reduce(
    (acc, current) => mergeObjects(acc, current, options),
    base,
  ) as DeepMergeResult<Objects>
}

function isMergeOptions(value: unknown): value is DeepMergeOptions {
  return isPlainObject(value) && 'arrayStrategy' in value
}
