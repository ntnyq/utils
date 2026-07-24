// Separate overloads preserve callback contextual typing.
// oxlint-disable typescript/unified-signatures

export type OrderByDirection = 'asc' | 'desc'
export type OrderByNulls = 'first' | 'last'
export type OrderByComparable = bigint | boolean | Date | number | string
export type OrderByValue = OrderByComparable | null | undefined

type OrderableKey<T> = {
  [Key in keyof T]-?: Exclude<
    T[Key],
    null | undefined
  > extends OrderByComparable
    ? Key
    : never
}[keyof T]

export type OrderBySelector<T> = OrderableKey<T> | ((item: T) => OrderByValue)

export interface OrderByOptions {
  /**
   * Sort direction for every selector, or one direction per selector.
   *
   * Missing directions default to `asc`.
   *
   * @default `asc`
   */
  directions?: OrderByDirection | readonly OrderByDirection[]

  /**
   * Position of null, undefined, NaN, and invalid Date values.
   *
   * This position is not reversed for descending sorts.
   *
   * @default `last`
   */
  nulls?: OrderByNulls

  /**
   * Optional locale-aware string comparator.
   *
   * Without a collator, strings use JavaScript's deterministic UTF-16
   * lexicographic order.
   */
  collator?: Intl.Collator
}

const ORDER_VALUE_RANK = {
  bigint: 1,
  boolean: 0,
  date: 3,
  number: 2,
  string: 4,
} as const

function isEmptyOrderValue(value: OrderByValue): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'number' && Number.isNaN(value)) ||
    (value instanceof Date && Number.isNaN(value.getTime()))
  )
}

function getValueRank(value: OrderByComparable): number {
  if (typeof value === 'boolean') {
    return ORDER_VALUE_RANK.boolean
  }
  if (typeof value === 'bigint') {
    return ORDER_VALUE_RANK.bigint
  }
  if (typeof value === 'number') {
    return ORDER_VALUE_RANK.number
  }
  if (value instanceof Date) {
    return ORDER_VALUE_RANK.date
  }
  return ORDER_VALUE_RANK.string
}

function compareStrings(
  left: string,
  right: string,
  collator: Intl.Collator | undefined,
): number {
  if (collator) {
    return collator.compare(left, right)
  }
  if (left === right) {
    return 0
  }
  return left < right ? -1 : 1
}

function compareValues(
  left: OrderByComparable,
  right: OrderByComparable,
  collator: Intl.Collator | undefined,
): number {
  if (typeof left === 'string' && typeof right === 'string') {
    return compareStrings(left, right, collator)
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }

  const leftRank = getValueRank(left)
  const rightRank = getValueRank(right)
  if (leftRank !== rightRank) {
    return leftRank - rightRank
  }

  if (left === right) {
    return 0
  }
  return left < right ? -1 : 1
}

function assertOrderByValue(value: unknown): asserts value is OrderByValue {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    value instanceof Date
  ) {
    return
  }

  throw new TypeError('Order selector must return a comparable value')
}

function validateOptions(options: OrderByOptions): void {
  const { directions = 'asc', nulls = 'last' } = options
  const values = Array.isArray(directions) ? directions : [directions]

  if (values.some(direction => direction !== 'asc' && direction !== 'desc')) {
    throw new TypeError('Sort direction must be "asc" or "desc"')
  }
  if (nulls !== 'first' && nulls !== 'last') {
    throw new TypeError('Null position must be "first" or "last"')
  }
}

function getDirection(
  directions: OrderByDirection | readonly OrderByDirection[],
  index: number,
): OrderByDirection {
  return typeof directions === 'string'
    ? directions
    : (directions[index] ?? 'asc')
}

function selectValue<T>(item: T, selector: OrderBySelector<T>): OrderByValue {
  let value: unknown

  if (typeof selector === 'function') {
    value = selector(item)
  } else if (item === null || item === undefined) {
    value = undefined
  } else {
    value = (item as Record<PropertyKey, unknown>)[selector]
  }

  assertOrderByValue(value)
  return value
}

function compareSelectedValues(
  left: OrderByValue,
  right: OrderByValue,
  direction: OrderByDirection,
  nulls: OrderByNulls,
  collator: Intl.Collator | undefined,
): number {
  const leftIsEmpty = isEmptyOrderValue(left)
  const rightIsEmpty = isEmptyOrderValue(right)

  if (leftIsEmpty && rightIsEmpty) {
    return 0
  }
  if (leftIsEmpty) {
    return nulls === 'first' ? -1 : 1
  }
  if (rightIsEmpty) {
    return nulls === 'first' ? 1 : -1
  }

  const compared = compareValues(
    left as OrderByComparable,
    right as OrderByComparable,
    collator,
  )
  return direction === 'desc' ? -compared : compared
}

/**
 * Stably sorts an array by one or more property keys or selectors.
 *
 * The source array is never mutated. Nullish values, NaN, and invalid dates
 * use the configured null position independently of sort direction.
 *
 * @param array - Source array.
 * @param selectors - Property keys or selectors, evaluated in priority order.
 * @param options - Direction, null placement, and string comparison options.
 * @returns A sorted copy of the source array.
 *
 * @example
 *
 * ```typescript
 * import { orderBy } from '@ntnyq/utils'
 *
 * const rows = [
 *   { team: 'b', score: 1 },
 *   { team: 'a', score: 2 },
 *   { team: 'a', score: 1 },
 * ]
 *
 * const result = orderBy(rows, ['team', 'score'], {
 *   directions: ['asc', 'desc'],
 * })
 * ```
 */
export function orderBy<T>(
  array: readonly T[],
  selector: (item: T) => OrderByValue,
  options?: OrderByOptions,
): T[]

export function orderBy<T>(
  array: readonly T[],
  selector: OrderableKey<T>,
  options?: OrderByOptions,
): T[]

export function orderBy<T>(
  array: readonly T[],
  selectors: readonly OrderBySelector<T>[],
  options?: OrderByOptions,
): T[]

export function orderBy<T>(
  array: readonly T[],
  selectors: OrderBySelector<T> | readonly OrderBySelector<T>[],
  options: OrderByOptions = {},
): T[] {
  validateOptions(options)

  const normalizedSelectors = Array.isArray(selectors) ? selectors : [selectors]
  if (normalizedSelectors.length === 0) {
    return [...array]
  }

  const { collator, directions = 'asc', nulls = 'last' } = options

  return array
    .map((item, index) => ({
      index,
      item,
      values: normalizedSelectors.map(selector => selectValue(item, selector)),
    }))
    .toSorted((leftEntry, rightEntry) => {
      for (
        let selectorIndex = 0;
        selectorIndex < normalizedSelectors.length;
        selectorIndex++
      ) {
        const leftValue = leftEntry.values[selectorIndex]!
        const rightValue = rightEntry.values[selectorIndex]!
        const compared = compareSelectedValues(
          leftValue,
          rightValue,
          getDirection(directions, selectorIndex),
          nulls,
          collator,
        )
        if (compared !== 0) {
          return compared
        }
      }

      return leftEntry.index - rightEntry.index
    })
    .map(entry => entry.item)
}
