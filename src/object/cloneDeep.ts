function cloneDescriptor(
  descriptor: PropertyDescriptor,
  hash: WeakMap<object, unknown>,
): PropertyDescriptor {
  if ('value' in descriptor) {
    return {
      ...descriptor,
      value: cloneDeep(descriptor.value, hash),
    }
  }
  return descriptor
}

function cloneArrayBufferView<T extends ArrayBufferView>(
  value: T,
  hash: WeakMap<object, unknown>,
): T {
  const buffer = cloneDeep(value.buffer, hash)

  if (value instanceof DataView) {
    return new DataView(
      buffer,
      value.byteOffset,
      value.byteLength,
    ) as unknown as T
  }

  const TypedArray = value.constructor as new (
    buffer: ArrayBufferLike,
    byteOffset: number,
    length?: number,
  ) => T
  const length = 'length' in value ? (value.length as number) : undefined
  return new TypedArray(buffer, value.byteOffset, length)
}

/**
 * Deeply clones a value, preserving built-in collection and buffer types,
 * property descriptors, prototypes, symbol keys, and circular references.
 * @param value - The value to clone.
 * @param hash - Objects already cloned during this operation.
 * @returns A deep clone of the input value.
 */
// oxlint-disable-next-line complexity
export function cloneDeep<T>(
  value: T,
  hash: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
): T {
  if (
    (typeof value !== 'object' && typeof value !== 'function') ||
    value === null
  ) {
    return value
  }

  if (typeof value === 'function') {
    return value
  }

  if (hash.has(value)) {
    return hash.get(value) as T
  }

  if (value instanceof Date) {
    const result = new Date(value)
    hash.set(value, result)
    return result as T
  }

  if (value instanceof RegExp) {
    const result = new RegExp(value.source, value.flags)
    result.lastIndex = value.lastIndex
    hash.set(value, result)
    return result as T
  }

  if (value instanceof Map) {
    const result = new Map()
    hash.set(value, result)
    for (const [key, item] of value) {
      result.set(cloneDeep(key, hash), cloneDeep(item, hash))
    }
    return result as T
  }

  if (value instanceof Set) {
    const result = new Set()
    hash.set(value, result)
    for (const item of value) {
      result.add(cloneDeep(item, hash))
    }
    return result as T
  }

  if (value instanceof ArrayBuffer) {
    // oxlint-disable-next-line unicorn/prefer-spread
    const result = value.slice(0)
    hash.set(value, result)
    return result as T
  }

  if (
    typeof SharedArrayBuffer !== 'undefined' &&
    value instanceof SharedArrayBuffer
  ) {
    // oxlint-disable-next-line unicorn/prefer-spread
    const result = value.slice(0)
    hash.set(value, result)
    return result as T
  }

  if (ArrayBuffer.isView(value)) {
    const result = cloneArrayBufferView(value, hash)
    hash.set(value, result)
    return result as T
  }

  if (
    value instanceof Promise ||
    value instanceof WeakMap ||
    value instanceof WeakSet
  ) {
    return value
  }

  const result: object = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value))
  if (Array.isArray(result)) {
    result.length = (value as unknown[]).length
  }
  hash.set(value, result)

  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)
    if (descriptor) {
      Object.defineProperty(result, key, cloneDescriptor(descriptor, hash))
    }
  }

  return result as T
}
