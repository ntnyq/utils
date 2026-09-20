interface CloneDeepContext {
  descriptorsConfigurable: boolean
  hash: WeakMap<object, unknown>
}

interface CloneDeepInternalOptions {
  descriptorsConfigurable?: boolean
}

function cloneDescriptor(
  descriptor: PropertyDescriptor,
  context: CloneDeepContext,
): PropertyDescriptor {
  const clonedDescriptor =
    'value' in descriptor
      ? {
          ...descriptor,
          value: cloneDeepValue(descriptor.value, context),
        }
      : { ...descriptor }

  if (context.descriptorsConfigurable) {
    clonedDescriptor.configurable = true
  }

  return clonedDescriptor
}

function copyOwnProperties(
  source: object,
  target: object,
  context: CloneDeepContext,
  skippedKeys: ReadonlySet<PropertyKey> = new Set(),
): void {
  for (const key of Reflect.ownKeys(source)) {
    if (!skippedKeys.has(key)) {
      const descriptor = Object.getOwnPropertyDescriptor(source, key)
      if (descriptor) {
        Object.defineProperty(target, key, cloneDescriptor(descriptor, context))
      }
    }
  }
}

function preservePrototype(source: object, target: object): void {
  const sourcePrototype = Object.getPrototypeOf(source)
  if (Object.getPrototypeOf(target) !== sourcePrototype) {
    Object.setPrototypeOf(target, sourcePrototype)
  }
}

function cloneArray(value: unknown[], context: CloneDeepContext): unknown[] {
  const result: unknown[] = []
  preservePrototype(value, result)
  context.hash.set(value, result)
  copyOwnProperties(value, result, context, new Set(['length']))

  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length')
  if (lengthDescriptor) {
    Object.defineProperty(result, 'length', lengthDescriptor)
  }

  return result
}

function cloneArrayBufferView<T extends ArrayBufferView>(
  value: T,
  buffer: ArrayBufferLike,
): T {
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

function cloneBufferShell<Buffer extends ArrayBuffer | SharedArrayBuffer>(
  value: Buffer,
  context: CloneDeepContext,
): Buffer {
  // oxlint-disable-next-line unicorn/prefer-spread
  const result = value.slice(0) as Buffer
  preservePrototype(value, result)
  context.hash.set(value, result)
  return result
}

function cloneDate(value: Date, context: CloneDeepContext): Date {
  // oxlint-disable-next-line unicorn/consistent-date-clone
  const result = new Date(value.getTime())
  preservePrototype(value, result)
  context.hash.set(value, result)
  copyOwnProperties(value, result, context)
  return result
}

function cloneRegExp(value: RegExp, context: CloneDeepContext): RegExp {
  const result = new RegExp(value.source, value.flags)
  preservePrototype(value, result)
  context.hash.set(value, result)
  const lastIndexDescriptor = Object.getOwnPropertyDescriptor(
    value,
    'lastIndex',
  )
  if (lastIndexDescriptor) {
    Object.defineProperty(result, 'lastIndex', lastIndexDescriptor)
  }
  copyOwnProperties(value, result, context, new Set(['lastIndex']))
  return result
}

function cloneMap(
  value: Map<unknown, unknown>,
  context: CloneDeepContext,
): Map<unknown, unknown> {
  const result = new Map()
  preservePrototype(value, result)
  context.hash.set(value, result)
  for (const [key, item] of value) {
    result.set(cloneDeepValue(key, context), cloneDeepValue(item, context))
  }
  copyOwnProperties(value, result, context)
  return result
}

function cloneSet(
  value: Set<unknown>,
  context: CloneDeepContext,
): Set<unknown> {
  const result = new Set()
  preservePrototype(value, result)
  context.hash.set(value, result)
  for (const item of value) {
    result.add(cloneDeepValue(item, context))
  }
  copyOwnProperties(value, result, context)
  return result
}

function cloneArrayBuffer(
  value: ArrayBuffer,
  context: CloneDeepContext,
): ArrayBuffer {
  const result = cloneBufferShell(value, context)
  copyOwnProperties(value, result, context)
  return result
}

function cloneSharedArrayBuffer(
  value: SharedArrayBuffer,
  context: CloneDeepContext,
): SharedArrayBuffer {
  const result = cloneBufferShell(value, context)
  copyOwnProperties(value, result, context)
  return result
}

function cloneView<T extends ArrayBufferView>(
  value: T,
  context: CloneDeepContext,
): T {
  const sourceBuffer = value.buffer
  const cachedBuffer = context.hash.get(sourceBuffer)
  const buffer =
    (cachedBuffer as ArrayBufferLike | undefined) ??
    cloneBufferShell(sourceBuffer, context)
  const result = cloneArrayBufferView(value, buffer)
  preservePrototype(value, result)
  context.hash.set(value, result)
  copyOwnProperties(value, result, context)
  if (!cachedBuffer) {
    copyOwnProperties(sourceBuffer, buffer, context)
  }
  return result
}

function cloneObject(value: object, context: CloneDeepContext): object {
  const result = Object.create(Object.getPrototypeOf(value)) as object
  context.hash.set(value, result)
  copyOwnProperties(value, result, context)
  return result
}

// oxlint-disable-next-line complexity
function cloneDeepValue<T>(value: T, context: CloneDeepContext): T {
  if (
    (typeof value !== 'object' && typeof value !== 'function') ||
    value === null
  ) {
    return value
  }

  if (typeof value === 'function') {
    return value
  }

  if (context.hash.has(value)) {
    return context.hash.get(value) as T
  }

  if (Array.isArray(value)) {
    return cloneArray(value, context) as T
  }

  if (value instanceof Date) {
    return cloneDate(value, context) as T
  }

  if (value instanceof RegExp) {
    return cloneRegExp(value, context) as T
  }

  if (value instanceof Map) {
    return cloneMap(value, context) as T
  }

  if (value instanceof Set) {
    return cloneSet(value, context) as T
  }

  if (value instanceof ArrayBuffer) {
    return cloneArrayBuffer(value, context) as T
  }

  if (
    typeof SharedArrayBuffer !== 'undefined' &&
    value instanceof SharedArrayBuffer
  ) {
    return cloneSharedArrayBuffer(value, context) as T
  }

  if (ArrayBuffer.isView(value)) {
    return cloneView(value, context) as T
  }

  // Descriptor copies cannot recreate internal slots of opaque built-ins.
  const tag =
    Symbol.toStringTag in value
      ? undefined
      : Object.prototype.toString.call(value)
  if (tag !== '[object Object]' && tag !== '[object Error]') {
    return value
  }

  return cloneObject(value, context) as T
}

export function cloneDeepInternal<T>(
  value: T,
  hash: WeakMap<object, unknown> = new WeakMap<object, unknown>(),
  options: CloneDeepInternalOptions = {},
): T {
  return cloneDeepValue(value, {
    descriptorsConfigurable: options.descriptorsConfigurable ?? false,
    hash,
  })
}
