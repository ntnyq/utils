export type ListToTreeCycleStrategy = 'root' | 'throw'
export type ListToTreeOrphanStrategy = 'discard' | 'root' | 'throw'

export type ListToTreeNode<
  Item extends object,
  ChildrenKey extends PropertyKey,
> = Omit<Item, Extract<keyof Item, ChildrenKey>> & {
  [Key in ChildrenKey]: ListToTreeNode<Item, ChildrenKey>[]
}

export interface ListToTreeOptions<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey = 'children',
> {
  /**
   * Property used for generated child arrays.
   *
   * @default 'children'
   */
  childrenKey?: ChildrenKey

  /**
   * Handling for circular parent relationships.
   *
   * @default 'throw'
   */
  cycleStrategy?: ListToTreeCycleStrategy

  /**
   * Returns the unique identifier for an item.
   *
   * @default item => item.id
   */
  getId?: (item: Item) => Identifier

  /**
   * Returns the parent identifier for an item.
   *
   * @default item => item.parentId
   */
  getParentId?: (item: Item) => Identifier | null | undefined

  /**
   * Handling for items whose parent cannot be found.
   *
   * @default 'root'
   */
  orphanStrategy?: ListToTreeOrphanStrategy

  /**
   * Parent identifiers that mark root items.
   *
   * @default [null, undefined]
   */
  rootParentIds?: readonly (Identifier | null | undefined)[]
}

interface TreeEntry<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
> {
  children: ListToTreeNode<Item, ChildrenKey>[]
  id: Identifier
  node: ListToTreeNode<Item, ChildrenKey>
  parentId: Identifier | null | undefined
}

function cloneListItem<Item extends object, ChildrenKey extends PropertyKey>(
  item: Item,
  childrenKey: ChildrenKey,
): {
  children: ListToTreeNode<Item, ChildrenKey>[]
  node: ListToTreeNode<Item, ChildrenKey>
} {
  const node = Object.create(Object.getPrototypeOf(item)) as ListToTreeNode<
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

  const children: ListToTreeNode<Item, ChildrenKey>[] = []
  Object.defineProperty(node, childrenKey, {
    configurable: true,
    enumerable: true,
    value: children,
    writable: true,
  })

  return { children, node }
}

function isPropertyKey(value: unknown): value is PropertyKey {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol'
  )
}

function assertListToTreeStrategies(
  cycleStrategy: ListToTreeCycleStrategy,
  orphanStrategy: ListToTreeOrphanStrategy,
): void {
  if (cycleStrategy !== 'root' && cycleStrategy !== 'throw') {
    throw new TypeError('Invalid cycle strategy')
  }
  if (
    orphanStrategy !== 'discard' &&
    orphanStrategy !== 'root' &&
    orphanStrategy !== 'throw'
  ) {
    throw new TypeError('Invalid orphan strategy')
  }
}

function createTreeEntries<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  items: readonly Item[],
  childrenKey: ChildrenKey,
  getId: (item: Item) => Identifier,
  getParentId: (item: Item) => Identifier | null | undefined,
): {
  entries: TreeEntry<Item, Identifier, ChildrenKey>[]
  entriesById: Map<Identifier, TreeEntry<Item, Identifier, ChildrenKey>>
} {
  const entries: TreeEntry<Item, Identifier, ChildrenKey>[] = []
  const entriesById = new Map<
    Identifier,
    TreeEntry<Item, Identifier, ChildrenKey>
  >()

  for (const item of items) {
    const id = getId(item)
    const parentId = getParentId(item)

    if (!isPropertyKey(id)) {
      throw new TypeError('Tree item identifier must be a property key')
    }
    if (
      parentId !== null &&
      parentId !== undefined &&
      !isPropertyKey(parentId)
    ) {
      throw new TypeError(
        'Tree item parent identifier must be a property key or nullish',
      )
    }
    if (entriesById.has(id)) {
      throw new TypeError(`Duplicate tree item identifier: ${String(id)}`)
    }

    const { children, node } = cloneListItem(item, childrenKey)
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
    TreeEntry<Item, Identifier, ChildrenKey>
  >,
  isRootParent: (parentId: Identifier | null | undefined) => boolean,
): Set<Identifier> {
  const cycleIds = new Set<Identifier>()
  const resolvedIds = new Set<Identifier>()

  for (const entry of entriesById.values()) {
    const path: Identifier[] = []
    const pathIndexes = new Map<Identifier, number>()
    let current: TreeEntry<Item, Identifier, ChildrenKey> | undefined = entry

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

function linkTreeEntries<
  Item extends object,
  Identifier extends PropertyKey,
  ChildrenKey extends PropertyKey,
>(
  entries: readonly TreeEntry<Item, Identifier, ChildrenKey>[],
  entriesById: ReadonlyMap<
    Identifier,
    TreeEntry<Item, Identifier, ChildrenKey>
  >,
  cycleIds: ReadonlySet<Identifier>,
  isRootParent: (parentId: Identifier | null | undefined) => boolean,
  orphanStrategy: ListToTreeOrphanStrategy,
): ListToTreeNode<Item, ChildrenKey>[] {
  const roots: ListToTreeNode<Item, ChildrenKey>[] = []

  for (const entry of entries) {
    if (cycleIds.has(entry.id) || isRootParent(entry.parentId)) {
      roots.push(entry.node)
    } else {
      const parent =
        entry.parentId === null || entry.parentId === undefined
          ? undefined
          : entriesById.get(entry.parentId)

      if (parent) {
        parent.children.push(entry.node)
      } else if (orphanStrategy === 'root') {
        roots.push(entry.node)
      } else if (orphanStrategy === 'throw') {
        throw new TypeError(
          `Missing parent for tree item identifier: ${String(entry.id)}`,
        )
      }
    }
  }

  return roots
}

/**
 * Builds a tree from a flat list without mutating source items.
 *
 * Items are cloned, source order is preserved, and custom identifier
 * selectors and child keys are supported.
 *
 * @param items - Flat source items.
 * @param options - Identifier, child-key, root, orphan, and cycle options.
 * @returns Built root nodes.
 */
export function listToTree<
  Item extends object,
  Identifier extends PropertyKey = Item extends {
    id: infer Id extends PropertyKey
  }
    ? Id
    : PropertyKey,
  ChildrenKey extends PropertyKey = 'children',
>(
  items: readonly Item[],
  options: ListToTreeOptions<Item, Identifier, ChildrenKey> = {},
): ListToTreeNode<Item, ChildrenKey>[] {
  const {
    childrenKey = 'children' as ChildrenKey,
    cycleStrategy = 'throw',
    getId = item => Reflect.get(item, 'id') as Identifier,
    getParentId = item =>
      Reflect.get(item, 'parentId') as Identifier | null | undefined,
    orphanStrategy = 'root',
    rootParentIds = [null, undefined],
  } = options

  assertListToTreeStrategies(cycleStrategy, orphanStrategy)
  const { entries, entriesById } = createTreeEntries(
    items,
    childrenKey,
    getId,
    getParentId,
  )
  const isRootParent = (parentId: Identifier | null | undefined): boolean =>
    rootParentIds.some(rootParentId => Object.is(rootParentId, parentId))
  const cycleIds = collectCycleIds(entriesById, isRootParent)

  if (cycleIds.size > 0 && cycleStrategy === 'throw') {
    throw new TypeError('Tree contains a circular parent relationship')
  }

  return linkTreeEntries(
    entries,
    entriesById,
    cycleIds,
    isRootParent,
    orphanStrategy,
  )
}
