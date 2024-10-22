/**
 * Get array item by index, negative for backward
 * @param array - given array
 * @param index - index of item
 * @returns undefined if not match, otherwise matched item
 */
export function at<T>(array: readonly T[], index: number) {
  const length = array.length

  if (!length) return undefined

  if (index < 0) {
    index += length
  }

  return array[index]
}

/**
 * Get the last item of given array
 * @param array - given array
 * @returns undefined if empty array, otherwise last item
 */
export function last<T>(array: readonly T[]) {
  return at(array, -1)
}
