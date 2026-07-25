import { isPlainObject } from './isPlainObject'

export interface DeepMergeOptions {
  /**
   * Strategy for merging arrays.
   *
   * @default 'replace'
   */
  arrayStrategy?: 'replace' | 'concat'
}

export type DeepMergeArrayStrategy = NonNullable<
  DeepMergeOptions['arrayStrategy']
>

type ResolveDeepMergeArrayStrategy<Options extends DeepMergeOptions> =
  Options extends { arrayStrategy: 'concat' }
    ? 'concat'
    : Options extends { arrayStrategy?: 'replace' | undefined }
      ? 'replace'
      : DeepMergeArrayStrategy

type AnyRecord = Record<PropertyKey, unknown>

type DeepMergeValue<
  Left,
  Right,
  ArrayStrategy extends DeepMergeArrayStrategy,
> = Left extends readonly unknown[]
  ? Right extends readonly unknown[]
    ? ArrayStrategy extends 'concat'
      ? [...Left, ...Right]
      : Right
    : Right
  : Left extends AnyRecord
    ? Right extends AnyRecord
      ? DeepMergeTwo<Left, Right, ArrayStrategy>
      : Right
    : Right

export type DeepMergeTwo<
  Left,
  Right,
  ArrayStrategy extends DeepMergeArrayStrategy = 'replace',
> = Left extends AnyRecord
  ? Right extends AnyRecord
    ? {
        [K in keyof Left | keyof Right]: K extends keyof Right
          ? K extends keyof Left
            ? DeepMergeValue<Left[K], Right[K], ArrayStrategy>
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
  ArrayStrategy extends DeepMergeArrayStrategy = 'replace',
> = Objects extends readonly [infer First, ...infer Rest]
  ? DeepMergeResult<
      Rest,
      DeepMergeTwo<Accumulator, First, ArrayStrategy>,
      ArrayStrategy
    >
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
      const clonedDescriptor =
        'value' in descriptor
          ? { ...descriptor, value: cloneValue(descriptor.value, context) }
          : descriptor
      Object.defineProperty(
        output,
        key,
        key === 'length' && context.options.arrayStrategy === 'concat'
          ? { ...clonedDescriptor, writable: true }
          : clonedDescriptor,
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
    if (context.options.arrayStrategy === 'concat') {
      const knownRight = context.seen.get(rightValue)
      if (knownRight) {
        return knownRight
      }

      const sourceItems = [...rightValue]
      context.seen.set(rightValue, leftValue)
      for (const item of sourceItems) {
        leftValue.push(cloneValue(item, context))
      }
      return leftValue
    }

    return cloneArray(rightValue, context)
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
  forceTarget = false,
): AnyRecord {
  const knownRight = context.seen.get(right)
  if (knownRight && !forceTarget) {
    return knownRight as AnyRecord
  }

  const output = left
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

function mergeAll<
  const Objects extends readonly AnyRecord[],
  ArrayStrategy extends DeepMergeArrayStrategy,
>(
  objects: Objects,
  options: { arrayStrategy: ArrayStrategy },
): DeepMergeResult<Objects, {}, ArrayStrategy> {
  if (objects.length === 0) {
    return {} as DeepMergeResult<Objects, {}, ArrayStrategy>
  }

  const context: MergeContext = {
    options,
    seen: new WeakMap(),
  }
  const [first, ...rest] = objects
  const output = cloneRecord(first!, context)

  for (const object of rest) {
    mergeRecords(output, object, context, true)
  }

  return output as DeepMergeResult<Objects, {}, ArrayStrategy>
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
  const Options extends DeepMergeOptions,
  const Objects extends readonly AnyRecord[],
>(
  options: Options,
  ...objects: Objects
): DeepMergeResult<Objects, {}, ResolveDeepMergeArrayStrategy<Options>> {
  return mergeAll(objects, {
    arrayStrategy: options.arrayStrategy ?? 'replace',
  }) as DeepMergeResult<Objects, {}, ResolveDeepMergeArrayStrategy<Options>>
}
