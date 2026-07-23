interface ComparisonState {
  leftToRight: Map<object, object>
  rightToLeft: Map<object, object>
}

function forkState(state: ComparisonState): ComparisonState {
  return {
    leftToRight: new Map(state.leftToRight),
    rightToLeft: new Map(state.rightToLeft),
  }
}

function commitState(target: ComparisonState, source: ComparisonState): void {
  target.leftToRight = source.leftToRight
  target.rightToLeft = source.rightToLeft
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

function equalDescriptors(
  left: PropertyDescriptor,
  right: PropertyDescriptor,
  state: ComparisonState,
): boolean {
  if (
    left.configurable !== right.configurable ||
    left.enumerable !== right.enumerable ||
    ('writable' in left && left.writable !== right.writable)
  ) {
    return false
  }

  if ('value' in left && 'value' in right) {
    return compare(left.value, right.value, state)
  }

  return (
    !('value' in left) &&
    !('value' in right) &&
    left.get === right.get &&
    left.set === right.set
  )
}

function equalMaps(
  left: Map<unknown, unknown>,
  right: Map<unknown, unknown>,
  state: ComparisonState,
): boolean {
  if (left.size !== right.size) {
    return false
  }

  const unmatched = [...right.entries()]
  for (const [leftKey, leftValue] of left) {
    let matchIndex = -1

    for (let index = 0; index < unmatched.length; index++) {
      const [rightKey, rightValue] = unmatched[index]!
      const candidate = forkState(state)
      if (
        compare(leftKey, rightKey, candidate) &&
        compare(leftValue, rightValue, candidate)
      ) {
        matchIndex = index
        commitState(state, candidate)
        break
      }
    }

    if (matchIndex === -1) {
      return false
    }
    unmatched.splice(matchIndex, 1)
  }

  return true
}

function equalSets(
  left: Set<unknown>,
  right: Set<unknown>,
  state: ComparisonState,
): boolean {
  if (left.size !== right.size) {
    return false
  }

  const unmatched = [...right]
  for (const leftValue of left) {
    const matchIndex = unmatched.findIndex(rightValue => {
      const candidate = forkState(state)
      if (!compare(leftValue, rightValue, candidate)) {
        return false
      }
      commitState(state, candidate)
      return true
    })

    if (matchIndex === -1) {
      return false
    }
    unmatched.splice(matchIndex, 1)
  }

  return true
}

// oxlint-disable-next-line complexity
function compare(
  left: unknown,
  right: unknown,
  state: ComparisonState,
): boolean {
  if (Object.is(left, right)) {
    return true
  }

  if (
    (typeof left !== 'object' && typeof left !== 'function') ||
    left === null ||
    (typeof right !== 'object' && typeof right !== 'function') ||
    right === null ||
    typeof left === 'function' ||
    typeof right === 'function'
  ) {
    return false
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
    return left.getTime() === right.getTime()
  }

  if (left instanceof RegExp && right instanceof RegExp) {
    return (
      left.source === right.source &&
      left.flags === right.flags &&
      left.lastIndex === right.lastIndex
    )
  }

  if (left instanceof Map && right instanceof Map) {
    return equalMaps(left, right, state)
  }

  if (left instanceof Set && right instanceof Set) {
    return equalSets(left, right, state)
  }

  if (left instanceof ArrayBuffer && right instanceof ArrayBuffer) {
    return equalBytes(new Uint8Array(left), new Uint8Array(right))
  }

  if (isSharedArrayBuffer(left) && isSharedArrayBuffer(right)) {
    return equalBytes(new Uint8Array(left), new Uint8Array(right))
  }

  if (ArrayBuffer.isView(left) && ArrayBuffer.isView(right)) {
    return left.constructor === right.constructor && equalBytes(left, right)
  }

  if (!isStructurallyComparable(left) || !isStructurallyComparable(right)) {
    return false
  }

  const leftKeys = Reflect.ownKeys(left)
  const rightKeys = Reflect.ownKeys(right)
  if (
    leftKeys.length !== rightKeys.length ||
    leftKeys.some(key => !Object.hasOwn(right, key))
  ) {
    return false
  }

  return leftKeys.every(key => {
    const leftDescriptor = Object.getOwnPropertyDescriptor(left, key)
    const rightDescriptor = Object.getOwnPropertyDescriptor(right, key)
    return (
      leftDescriptor !== undefined &&
      rightDescriptor !== undefined &&
      equalDescriptors(leftDescriptor, rightDescriptor, state)
    )
  })
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
  return compare(value1, value2, {
    leftToRight: new Map(),
    rightToLeft: new Map(),
  })
}
