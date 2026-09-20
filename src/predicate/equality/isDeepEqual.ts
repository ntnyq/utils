interface ValueComparison {
  kind: 'value'
  left: unknown
  right: unknown
}

interface CollectionComparison {
  kind: 'collection'
  left: readonly (readonly unknown[])[]
  right: readonly (readonly unknown[])[]
  candidateIndex: number
}

interface ComparisonState {
  leftToRight: Map<object, object>
  rightToLeft: Map<object, object>
  pending: (ValueComparison | CollectionComparison)[]
}

function forkState(state: ComparisonState): ComparisonState {
  return {
    leftToRight: new Map(state.leftToRight),
    rightToLeft: new Map(state.rightToLeft),
    pending: [...state.pending],
  }
}

function equalBytes(left: ArrayBufferView, right: ArrayBufferView): boolean {
  if (left.byteLength !== right.byteLength) {
    return false
  }

  const leftBytes = new Uint8Array(
    left.buffer,
    left.byteOffset,
    left.byteLength,
  )
  const rightBytes = new Uint8Array(
    right.buffer,
    right.byteOffset,
    right.byteLength,
  )
  return leftBytes.every((byte, index) => byte === rightBytes[index])
}

function isSharedArrayBuffer(value: object): value is SharedArrayBuffer {
  return (
    typeof SharedArrayBuffer !== 'undefined' &&
    value instanceof SharedArrayBuffer
  )
}

function isStructurallyComparable(value: object): boolean {
  const tag = Object.prototype.toString.call(value)
  return (
    tag === '[object Array]' ||
    tag === '[object Error]' ||
    tag === '[object Object]'
  )
}

function queueOwnProperties(
  left: object,
  right: object,
  state: ComparisonState,
): boolean {
  const leftKeys = Reflect.ownKeys(left)
  if (leftKeys.length !== Reflect.ownKeys(right).length) {
    return false
  }

  for (const key of leftKeys.reverse()) {
    const leftDescriptor = Object.getOwnPropertyDescriptor(left, key)
    const rightDescriptor = Object.getOwnPropertyDescriptor(right, key)
    if (
      !leftDescriptor ||
      !rightDescriptor ||
      leftDescriptor.configurable !== rightDescriptor.configurable ||
      leftDescriptor.enumerable !== rightDescriptor.enumerable
    ) {
      return false
    }

    if ('value' in leftDescriptor && 'value' in rightDescriptor) {
      if (leftDescriptor.writable !== rightDescriptor.writable) {
        return false
      }
      state.pending.push({
        kind: 'value',
        left: leftDescriptor.value,
        right: rightDescriptor.value,
      })
    } else if (
      'value' in leftDescriptor ||
      'value' in rightDescriptor ||
      leftDescriptor.get !== rightDescriptor.get ||
      leftDescriptor.set !== rightDescriptor.set
    ) {
      return false
    }
  }

  return true
}

function isObjectReference(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

function queueMapEntries(
  left: Map<unknown, unknown>,
  right: Map<unknown, unknown>,
  state: ComparisonState,
): boolean {
  if (left.size !== right.size) {
    return false
  }

  const remaining = new Map(right)
  const entries: unknown[][] = []
  for (const [key, value] of left) {
    if (isObjectReference(key)) {
      entries.push([key, value])
    } else {
      if (!remaining.has(key)) {
        return false
      }
      state.pending.push({
        kind: 'value',
        left: value,
        right: remaining.get(key),
      })
      remaining.delete(key)
    }
  }

  if (entries.length > 0) {
    state.pending.push({
      kind: 'collection',
      left: entries,
      right: [...remaining.entries()],
      candidateIndex: 0,
    })
  }
  return true
}

function queueSetEntries(
  left: Set<unknown>,
  right: Set<unknown>,
  state: ComparisonState,
): boolean {
  if (left.size !== right.size) {
    return false
  }

  const remaining = new Set(right)
  const entries: unknown[][] = []
  for (const value of left) {
    if (isObjectReference(value)) {
      entries.push([value])
    } else if (!remaining.delete(value)) {
      return false
    }
  }

  if (entries.length > 0) {
    state.pending.push({
      kind: 'collection',
      left: entries,
      right: Array.from(remaining, value => [value]),
      candidateIndex: 0,
    })
  }
  return true
}

/**
 * Retains alternative pairings until every pending comparison succeeds,
 * including properties outside the collection that constrain its aliases.
 */
function queueCollectionCandidate(
  task: CollectionComparison,
  state: ComparisonState,
  alternatives: ComparisonState[],
): void {
  const { candidateIndex, left, right } = task
  if (candidateIndex + 1 < right.length) {
    const alternative = forkState(state)
    alternative.pending.push({ ...task, candidateIndex: candidateIndex + 1 })
    alternatives.push(alternative)
  }

  if (left.length > 1) {
    state.pending.push({
      kind: 'collection',
      left: left.slice(1),
      right: right.toSpliced(candidateIndex, 1),
      candidateIndex: 0,
    })
  }

  const leftEntry = left[0]!
  const rightEntry = right[candidateIndex]!
  for (let index = leftEntry.length - 1; index >= 0; index--) {
    state.pending.push({
      kind: 'value',
      left: leftEntry[index],
      right: rightEntry[index],
    })
  }
}

// oxlint-disable-next-line complexity
function compare(
  left: unknown,
  right: unknown,
  state: ComparisonState,
): boolean {
  if (!isObjectReference(left) || !isObjectReference(right)) {
    return Object.is(left, right)
  }

  if (Object.getPrototypeOf(left) !== Object.getPrototypeOf(right)) {
    return false
  }

  const knownRight = state.leftToRight.get(left)
  const knownLeft = state.rightToLeft.get(right)
  if (knownRight || knownLeft) {
    return knownRight === right && knownLeft === left
  }
  state.leftToRight.set(left, right)
  state.rightToLeft.set(right, left)

  if (left instanceof Date && right instanceof Date) {
    return (
      (left === right || left.getTime() === right.getTime()) &&
      queueOwnProperties(left, right, state)
    )
  }

  if (left instanceof RegExp && right instanceof RegExp) {
    return (
      left.source === right.source &&
      left.flags === right.flags &&
      left.lastIndex === right.lastIndex &&
      queueOwnProperties(left, right, state)
    )
  }

  if (left instanceof Map && right instanceof Map) {
    return (
      queueOwnProperties(left, right, state) &&
      queueMapEntries(left, right, state)
    )
  }

  if (left instanceof Set && right instanceof Set) {
    return (
      queueOwnProperties(left, right, state) &&
      queueSetEntries(left, right, state)
    )
  }

  if (left instanceof ArrayBuffer && right instanceof ArrayBuffer) {
    return (
      equalBytes(new Uint8Array(left), new Uint8Array(right)) &&
      queueOwnProperties(left, right, state)
    )
  }

  if (isSharedArrayBuffer(left) && isSharedArrayBuffer(right)) {
    return (
      equalBytes(new Uint8Array(left), new Uint8Array(right)) &&
      queueOwnProperties(left, right, state)
    )
  }

  if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
    return (
      left.constructor === right.constructor &&
      equalBytes(left, right) &&
      queueOwnProperties(left, right, state)
    )
  }

  if (!isStructurallyComparable(left) || !isStructurallyComparable(right)) {
    return Object.is(left, right)
  }

  return queueOwnProperties(left, right, state)
}

/**
 * Checks whether two values are deeply equal, including supported built-in
 * collections and buffers, property descriptors, symbol keys, and cyclic
 * object graphs. Opaque built-ins such as Promise and WeakMap are equal only
 * when they are the same instance.
 * @param value1 - The first value to compare.
 * @param value2 - The second value to compare.
 * @returns Whether the values are deeply equal.
 */
export function isDeepEqual(value1: unknown, value2: unknown): boolean {
  let state: ComparisonState | undefined = {
    leftToRight: new Map(),
    rightToLeft: new Map(),
    pending: [{ kind: 'value', left: value1, right: value2 }],
  }
  const alternatives: ComparisonState[] = []

  while (state) {
    const task = state.pending.pop()
    if (!task) {
      return true
    }
    if (task.kind === 'collection') {
      queueCollectionCandidate(task, state, alternatives)
    } else if (!compare(task.left, task.right, state)) {
      state = alternatives.pop()
    }
  }
  return false
}
