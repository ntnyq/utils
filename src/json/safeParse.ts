import type { JsonValue } from '../types'

export type SafeParseReviver = (
  this: unknown,
  key: string,
  value: unknown,
) => unknown

export interface SafeParseOptions {
  /**
   * Transforms parsed values using the same traversal semantics as
   * `JSON.parse`.
   */
  reviver?: SafeParseReviver | undefined
}

export interface SafeParseSuccess<Value> {
  success: true
  value: Value
}

export interface SafeParseFailure {
  error: unknown
  success: false
}

export type SafeParseResult<Value = JsonValue> =
  | SafeParseFailure
  | SafeParseSuccess<Value>

/**
 * Parses JSON without throwing for invalid input or reviver failures.
 *
 * @param input - JSON text to parse.
 * @param options - Parse options.
 * @returns A success result containing the parsed value, or a failure result
 * containing the thrown error.
 *
 * @example
 *
 * ```typescript
 * import { safeParse } from '@ntnyq/utils'
 *
 * const result = safeParse('{"name":"Alice"}')
 * if (result.success) {
 *   console.log(result.value)
 * }
 * ```
 */
export function safeParse(
  input: string,
  options?: { reviver?: undefined },
): SafeParseResult<JsonValue>

export function safeParse(
  input: string,
  options: SafeParseOptions,
): SafeParseResult<unknown>

export function safeParse(
  input: string,
  options: SafeParseOptions = {},
): SafeParseResult<any> {
  try {
    return {
      success: true,
      value: JSON.parse(input, options.reviver) as unknown,
    }
  } catch (error) {
    return {
      error,
      success: false,
    }
  }
}
