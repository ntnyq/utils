/**
 * Get intersect items
 *
 * @returns intersect items
 */
export function intersect<T>(a: T[], b: T[]) {
  return a.filter(item => b.includes(item))
}
