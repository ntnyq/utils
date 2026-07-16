import { isPlainObject } from './isPlainObject'

export interface DeepMergeOptions {
  /**
   * Strategy for merging arrays.
   *
   * @default 'replace'
   */
  arrayStrategy?: 'replace' | 'concat'
}

type AnyRecord = Record<PropertyKey, unknown>

type DeepMergeValue<Left, Right> = Left extends readonly unknown[]
  ? Right extends readonly unknown[]
    ? Right
    : Right
  : Left extends AnyRecord
    ? Right extends AnyRecord
      ? DeepMergeTwo<Left, Right>
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

export type DeepMergeResult<
  Objects extends readonly unknown[],
  Accumulator = {},
> = Objects extends readonly [infer First, ...infer Rest]
  ? DeepMergeResult<Rest, DeepMergeTwo<Accumulator, First>>
  : Accumulator

interface MergeContext {
  options: Required<DeepMergeOptions>
  seen: WeakMap<object, unknown>
}

function isMergeableRecord(value: unknown): value is AnyRecord {
  return isPlainObject(value)
}

function cloneArray(value: unknown[], context: MergeContext): unknown[] {
  const cached = context.seen.get(value)
  if (cached) {
    return cached as unknown[]
  }

  const output: unknown[] = []
  output.length = value.length
  context.seen.set(value, output)

  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor) {
      Object.defineProperty(
        output,
        key,
        'value' in descriptor
          ? { ...descriptor, value: cloneValue(descriptor.value, context) }
          : descriptor,
      )
    }
  }

  return output
}

function cloneRecord(value: AnyRecord, context: MergeContext): AnyRecord {
  const cached = context.seen.get(value)
  if (cached) {
    return cached as AnyRecord
  }

  const output = Object.create(Object.getPrototypeOf(value)) as AnyRecord
  context.seen.set(value, output)

  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor) {
      Object.defineProperty(
        output,
        key,
        'value' in descriptor
          ? {
              ...descriptor,
              configurable: true,
              value: cloneValue(descriptor.value, context),
            }
          : { ...descriptor, configurable: true },
      )
    }
  }

  return output
}

function cloneValue(value: unknown, context: MergeContext): unknown {
  if (Array.isArray(value)) {
    return cloneArray(value, context)
  }
  if (isMergeableRecord(value)) {
    return cloneRecord(value, context)
  }
  return value
}

function mergeValue(
  leftValue: unknown,
  rightValue: unknown,
  context: MergeContext,
): unknown {
  if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
    const right = cloneArray(rightValue, context)
    return context.options.arrayStrategy === 'concat'
      ? [...leftValue, ...right]
      : right
  }

  if (isMergeableRecord(leftValue) && isMergeableRecord(rightValue)) {
    return mergeRecords(leftValue, rightValue, context)
  }

  return cloneValue(rightValue, context)
}

function mergeRecords(
  left: AnyRecord,
  right: AnyRecord,
  context: MergeContext,
): AnyRecord {
  const knownRight = context.seen.get(right)
  if (knownRight) {
    return knownRight as AnyRecord
  }

  const output = cloneRecord(left, context)
  context.seen.set(right, output)

  for (const key of Reflect.ownKeys(right)) {
    const rightDescriptor = Object.getOwnPropertyDescriptor(right, key)
    if (rightDescriptor) {
      if ('value' in rightDescriptor) {
        const leftDescriptor = Object.getOwnPropertyDescriptor(output, key)
        const nextValue =
          leftDescriptor && 'value' in leftDescriptor
            ? mergeValue(leftDescriptor.value, rightDescriptor.value, context)
            : cloneValue(rightDescriptor.value, context)

        Object.defineProperty(output, key, {
          ...rightDescriptor,
          configurable: true,
          value: nextValue,
        })
      } else {
        Object.defineProperty(output, key, {
          ...rightDescriptor,
          configurable: true,
        })
      }
    }
  }

  return output
}

function mergeAll<const Objects extends readonly AnyRecord[]>(
  objects: Objects,
  options: Required<DeepMergeOptions>,
): DeepMergeResult<Objects> {
  if (objects.length === 0) {
    return {} as DeepMergeResult<Objects>
  }

  const context: MergeContext = {
    options,
    seen: new WeakMap(),
  }
  const [first, ...rest] = objects
  let output = cloneRecord(first!, context)

  for (const object of rest) {
    output = mergeRecords(output, object, context)
  }

  return output as DeepMergeResult<Objects>
}

/**
 * Deeply merges data objects from left to right into a new object.
 * @param objects - Source objects from left to right.
 * @returns A new merged object.
 */
export function deepMerge<const Objects extends readonly AnyRecord[]>(
  ...objects: Objects
): DeepMergeResult<Objects> {
  return mergeAll(objects, { arrayStrategy: 'replace' })
}

/**
 * Deeply merges data objects with explicit options.
 * @param options - Merge options.
 * @param objects - Source objects from left to right.
 * @returns A new merged object.
 */
export function deepMergeWithOptions<
  const Objects extends readonly AnyRecord[],
>(options: DeepMergeOptions, ...objects: Objects): DeepMergeResult<Objects> {
  return mergeAll(objects, {
    arrayStrategy: options.arrayStrategy ?? 'replace',
  })
}
