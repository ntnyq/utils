export type SafeStringifyReplacer = (
  this: unknown,
  key: string,
  value: unknown,
) => unknown

export interface SafeStringifyOptions {
  /**
   * Serializes BigInt values.
   *
   * @default value => `${value}n`
   */
  bigintSerializer?: (value: bigint) => unknown

  /**
   * Replacement used for circular references.
   *
   * @default '[Circular]'
   */
  circularValue?: string | null

  /**
   * Serializes Error values.
   */
  errorSerializer?: (error: Error) => unknown

  /**
   * Value returned when serialization fails or produces undefined.
   *
   * @default '[Unserializable]'
   */
  fallback?: string | ((error: unknown) => string)

  /**
   * Applies a user-defined replacement before built-in normalization.
   */
  replacer?: SafeStringifyReplacer

  /**
   * JSON indentation.
   */
  space?: number | string
}

const DEFAULT_FALLBACK = '[Unserializable]'

function serializeError(error: Error): Record<string, unknown> {
  return {
    ...error,
    cause: error.cause,
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
}

function resolveFallback(
  fallback: NonNullable<SafeStringifyOptions['fallback']>,
  error?: unknown,
): string {
  return typeof fallback === 'function' ? fallback(error) : fallback
}

/**
 * Serializes a value while handling values unsupported by JSON.stringify.
 *
 * BigInt values become suffixed strings, errors become plain objects, and
 * circular references become a configurable replacement. Repeated references
 * that are not circular are serialized normally.
 *
 * @param value - Value to serialize.
 * @param options - Serialization options.
 * @returns Serialized value or the configured fallback.
 *
 * @example
 *
 * ```typescript
 * import { safeStringify } from '@ntnyq/utils'
 *
 * const value: Record<string, unknown> = { count: 1n }
 * value.self = value
 *
 * safeStringify(value)
 * // => '{"count":"1n","self":"[Circular]"}'
 * ```
 */
export function safeStringify(
  value: unknown,
  options: SafeStringifyOptions = {},
): string {
  const {
    bigintSerializer = bigint => `${bigint}n`,
    circularValue = '[Circular]',
    errorSerializer = serializeError,
    fallback = DEFAULT_FALLBACK,
    replacer,
    space,
  } = options
  const ancestors: object[] = []
  const serializedErrors = new WeakMap<Error, unknown>()

  function stringifyReplacer(
    this: unknown,
    key: string,
    nestedValue: unknown,
  ): unknown {
    let normalizedValue = replacer
      ? replacer.call(this, key, nestedValue)
      : nestedValue

    if (typeof normalizedValue === 'bigint') {
      normalizedValue = bigintSerializer(normalizedValue)
    } else if (normalizedValue instanceof Error) {
      if (serializedErrors.has(normalizedValue)) {
        normalizedValue = serializedErrors.get(normalizedValue)
      } else {
        const serializedError = errorSerializer(normalizedValue)
        serializedErrors.set(normalizedValue, serializedError)
        normalizedValue = serializedError
      }
    }

    if (typeof normalizedValue !== 'object' || normalizedValue === null) {
      return normalizedValue
    }

    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop()
    }

    if (ancestors.includes(normalizedValue)) {
      return circularValue
    }

    ancestors.push(normalizedValue)
    return normalizedValue
  }

  try {
    const serialized = JSON.stringify(value, stringifyReplacer, space)
    return serialized ?? resolveFallback(fallback)
  } catch (error) {
    return resolveFallback(fallback, error)
  }
}
