/**
 * Filters out falsy values from an array.
 * @param array - The array to filter.
 * @returns A new array containing only truthy values from the original array.
 *
 * @example
 *
 * ```typescript
 * const mixedArray = [0, 1, false, 2, '', 3, null, 4, undefined, 5];
 * const truthyArray = filterFalsy(mixedArray);
 * console.log(truthyArray); // Output: [1, 2, 3, 4, 5]
 *
 * ```
 */
export function filterFalsy<T>(
  array: T[],
): Exclude<T, false | 0 | 0n | '' | null | undefined>[] {
  return array.filter(Boolean) as Exclude<
    T,
    false | 0 | 0n | '' | null | undefined
  >[]
}
