// oxlint-disable no-continue

import { defineTreeChildren } from './defineTreeChildren'

export type FlatTreeCycleStrategy = 'root' | 'throw'
export type FlatTreeErrorMode = 'buildTree' | 'listToTree'
export type FlatTreeOrphanStrategy = 'discard' | 'root' | 'throw'

export type FlatTreeNode<Item, ChildrenKey extends PropertyKey> = Omit<
  Item,
  Extract<keyof Item, ChildrenKey>
> & {
  [Key in ChildrenKey]: FlatTreeNode<Item, ChildrenKey>[]
}

export interface BuildFlatTreeOptions<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
> {
  childrenKey: ChildrenKey
  cloneStrategy: 'descriptors' | 'enumerable'
  cycleStrategy: FlatTreeCycleStrategy
  errorMode: FlatTreeErrorMode
  getId: (item: Item) => unknown
  getParentId: (item: Item) => unknown
  orphanStrategy: FlatTreeOrphanStrategy
  rootParentIds: readonly (Identifier | null | undefined)[]
}

interface FlatTreeEntry<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
> {
  children: FlatTreeNode<Item, ChildrenKey>[]
  id: Identifier
  node: FlatTreeNode<Item, ChildrenKey>
  parentId: Identifier | null | undefined
}

function isPropertyKey(value: unknown): value is PropertyKey {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol'
  )
}

function createInvalidIdentifierError(
  errorMode: FlatTreeErrorMode,
  isParent: boolean,
): TypeError {
  if (errorMode === 'buildTree') {
    return new TypeError(
      isParent
        ? 'Parent identifier must be a property key or nullish'
        : 'Node identifier must be a property key',
    )
  }

  return new TypeError(
    isParent
      ? 'Tree item parent identifier must be a property key or nullish'
      : 'Tree item identifier must be a property key',
  )
}

function createDuplicateIdentifierError(
  errorMode: FlatTreeErrorMode,
  id: PropertyKey,
): Error {
  return errorMode === 'buildTree'
    ? new RangeError(`Duplicate tree identifier: ${String(id)}`)
    : new TypeError(`Duplicate tree item identifier: ${String(id)}`)
}

function createCycleError(
  errorMode: FlatTreeErrorMode,
  id: PropertyKey,
): Error {
  return errorMode === 'buildTree'
    ? new RangeError(`Tree parent cycle detected at identifier: ${String(id)}`)
    : new TypeError('Tree contains a circular parent relationship')
}

function createMissingParentError(
  errorMode: FlatTreeErrorMode,
  id: PropertyKey,
): Error {
  return errorMode === 'buildTree'
    ? new RangeError(`Missing parent for tree identifier: ${String(id)}`)
    : new TypeError(`Missing parent for tree item identifier: ${String(id)}`)
}

function cloneFlatTreeItem<
  Item extends object,
  ChildrenKey extends PropertyKey,
>(
  item: Item,
  childrenKey: ChildrenKey,
  cloneStrategy: BuildFlatTreeOptions<
    Item,
    PropertyKey,
    ChildrenKey
  >['cloneStrategy'],
): {
  children: FlatTreeNode<Item, ChildrenKey>[]
  node: FlatTreeNode<Item, ChildrenKey>
} {
  if (cloneStrategy === 'enumerable') {
    const node = { ...item } as FlatTreeNode<Item, ChildrenKey>
    const children: FlatTreeNode<Item, ChildrenKey>[] = []
    defineTreeChildren(node, childrenKey, children)
    return { children, node }
  }

  const node = Object.create(Object.getPrototypeOf(item)) as FlatTreeNode<
    Item,
    ChildrenKey
  >

  for (const key of Reflect.ownKeys(item)) {
    if (key !== childrenKey) {
      const descriptor = Object.getOwnPropertyDescriptor(item, key)
      if (descriptor) {
        Object.defineProperty(node, key, descriptor)
      }
    }
  }

  const children: FlatTreeNode<Item, ChildrenKey>[] = []
  defineTreeChildren(node, childrenKey, children)
  return { children, node }
}

function createFlatTreeEntries<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  items: readonly Item[],
  options: BuildFlatTreeOptions<Item, Identifier, ChildrenKey>,
): {
  entries: FlatTreeEntry<Item, Identifier, ChildrenKey>[]
  entriesById: Map<Identifier, FlatTreeEntry<Item, Identifier, ChildrenKey>>
} {
  const entries: FlatTreeEntry<Item, Identifier, ChildrenKey>[] = []
  const entriesById = new Map<
    Identifier,
    FlatTreeEntry<Item, Identifier, ChildrenKey>
  >()

  for (const item of items) {
    const idValue = options.getId(item)
    const parentIdValue = options.getParentId(item)

    if (!isPropertyKey(idValue)) {
      throw createInvalidIdentifierError(options.errorMode, false)
    }
    if (
      parentIdValue !== null &&
      parentIdValue !== undefined &&
      !isPropertyKey(parentIdValue)
    ) {
      throw createInvalidIdentifierError(options.errorMode, true)
    }

    const id = idValue as Identifier
    const parentId = parentIdValue as Identifier | null | undefined
    if (entriesById.has(id)) {
      throw createDuplicateIdentifierError(options.errorMode, id)
    }

    const { children, node } = cloneFlatTreeItem(
      item,
      options.childrenKey,
      options.cloneStrategy,
    )
    const entry = { children, id, node, parentId }
    entries.push(entry)
    entriesById.set(id, entry)
  }

  return { entries, entriesById }
}

function collectCycleIds<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  entriesById: ReadonlyMap<
    Identifier,
    FlatTreeEntry<Item, Identifier, ChildrenKey>
  >,
  isRootParent: (parentId: Identifier | null | undefined) => boolean,
): Set<Identifier> {
  const cycleIds = new Set<Identifier>()
  const resolvedIds = new Set<Identifier>()

  for (const entry of entriesById.values()) {
    const path: Identifier[] = []
    const pathIndexes = new Map<Identifier, number>()
    let current: FlatTreeEntry<Item, Identifier, ChildrenKey> | undefined =
      entry

    while (
      current &&
      !resolvedIds.has(current.id) &&
      !isRootParent(current.parentId)
    ) {
      const cycleIndex = pathIndexes.get(current.id)
      if (cycleIndex !== undefined) {
        for (const id of path.slice(cycleIndex)) {
          cycleIds.add(id)
        }
        break
      }

      pathIndexes.set(current.id, path.length)
      path.push(current.id)
      current =
        current.parentId === null || current.parentId === undefined
          ? undefined
          : entriesById.get(current.parentId)
    }

    for (const id of path) {
      resolvedIds.add(id)
    }
  }

  return cycleIds
}

function linkFlatTreeEntries<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  entries: readonly FlatTreeEntry<Item, Identifier, ChildrenKey>[],
  entriesById: ReadonlyMap<
    Identifier,
    FlatTreeEntry<Item, Identifier, ChildrenKey>
  >,
  cycleIds: ReadonlySet<Identifier>,
  options: BuildFlatTreeOptions<Item, Identifier, ChildrenKey>,
  isRootParent: (parentId: Identifier | null | undefined) => boolean,
): FlatTreeNode<Item, ChildrenKey>[] {
  const roots: FlatTreeNode<Item, ChildrenKey>[] = []

  for (const entry of entries) {
    if (cycleIds.has(entry.id) || isRootParent(entry.parentId)) {
      roots.push(entry.node)
      continue
    }

    const parent =
      entry.parentId === null || entry.parentId === undefined
        ? undefined
        : entriesById.get(entry.parentId)

    if (parent) {
      parent.children.push(entry.node)
    } else if (options.orphanStrategy === 'root') {
      roots.push(entry.node)
    } else if (options.orphanStrategy === 'throw') {
      throw createMissingParentError(options.errorMode, entry.id)
    }
  }

  return roots
}

/**
 * Builds a tree from flat items through normalized selector and policy options.
 *
 * The implementation owns identifier validation, cloning, cycle detection,
 * orphan handling, source ordering, and parent-child linking.
 *
 * @param items - Flat source items.
 * @param options - Identifier, cloning, root, cycle, and orphan policies.
 * @returns Newly allocated root nodes.
 */
export function buildFlatTree<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  items: readonly Item[],
  options: BuildFlatTreeOptions<Item, Identifier, ChildrenKey>,
): FlatTreeNode<Item, ChildrenKey>[] {
  if (options.cycleStrategy !== 'root' && options.cycleStrategy !== 'throw') {
    throw new TypeError('Invalid cycle strategy')
  }
  if (
    options.orphanStrategy !== 'discard' &&
    options.orphanStrategy !== 'root' &&
    options.orphanStrategy !== 'throw'
  ) {
    throw new TypeError('Invalid orphan strategy')
  }

  const { entries, entriesById } = createFlatTreeEntries(items, options)
  const isRootParent = (parentId: Identifier | null | undefined): boolean =>
    options.rootParentIds.some(rootParentId =>
      Object.is(rootParentId, parentId),
    )
  const cycleIds = collectCycleIds(entriesById, isRootParent)

  if (cycleIds.size > 0 && options.cycleStrategy === 'throw') {
    const firstCycleId = cycleIds.values().next().value
    if (firstCycleId !== undefined) {
      throw createCycleError(options.errorMode, firstCycleId)
    }
  }

  return linkFlatTreeEntries(
    entries,
    entriesById,
    cycleIds,
    options,
    isRootParent,
  )
}
