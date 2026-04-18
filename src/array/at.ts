/**
 * Get array item by index, negative for backward
 * @param array - given array
 * @param index - index of item
 * @returns undefined if not match, otherwise matched item
 * @example
 *
 * ```typescript
 * import { at } from '@ntnyq/utils'
 *
 * const result = at(['a', 'b', 'c'], -1)
 * console.log(result) // => 'c'
 * ```
 *
 */
export function at<T>(array: readonly T[], index: number): T | undefined {
  const length = array.length

  if (!length) {
    return undefined
  }

  if (index < 0) {
    index += length
  }

  return array[index]
}

/**
 * Get the last item of given array
 * @param array - given array
 * @returns undefined if empty array, otherwise last item
 * @example
 *
 * ```typescript
 * import { last } from '@ntnyq/utils'
 *
 * const result = last([1, 2, 3])
 * console.log(result) // => 3
 * ```
 *
 */
export function last<T>(array: readonly T[]): T | undefined {
  return at(array, -1)
}
