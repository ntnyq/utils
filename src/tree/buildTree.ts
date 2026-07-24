export type TreeIdentifier = string | number | symbol
export type BuildTreeOrphanStrategy = 'discard' | 'root' | 'throw'

export type BuiltTreeNode<
  T,
  ChildrenKey extends PropertyKey = 'children',
> = Omit<T, ChildrenKey> & {
  [Key in ChildrenKey]: BuiltTreeNode<T, ChildrenKey>[]
}

export interface BuildTreeOptions<
  T extends object,
  ChildrenKey extends PropertyKey = 'children',
> {
  /**
   * Property containing the unique node identifier.
   *
   * @default `id`
   */
  idKey?: keyof T

  /**
   * Property containing the parent identifier.
   *
   * @default `parentId`
   */
  parentIdKey?: keyof T

  /**
   * Property used for generated child arrays.
   *
   * @default `children`
   */
  childrenKey?: ChildrenKey

  /**
   * Explicit parent identifier used by root nodes.
   *
   * When omitted, null and undefined parent identifiers are roots.
   */
  rootParentId?: TreeIdentifier | null

  /**
   * Handling for nodes whose parent identifier cannot be found.
   *
   * @default `root`
   */
  orphanStrategy?: BuildTreeOrphanStrategy
}

interface BuildTreeEntry<T, ChildrenKey extends PropertyKey> {
  id: TreeIdentifier
  parentId: TreeIdentifier | null | undefined
  node: BuiltTreeNode<T, ChildrenKey>
}

function isTreeIdentifier(value: unknown): value is TreeIdentifier {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol'
  )
}

function validateBuildTreeOptions<T extends object>(
  childrenKey: PropertyKey,
  idKey: keyof T,
  parentIdKey: keyof T,
  orphanStrategy: BuildTreeOrphanStrategy,
): void {
  if (
    childrenKey === (idKey as PropertyKey) ||
    childrenKey === (parentIdKey as PropertyKey)
  ) {
    throw new TypeError('Children key must differ from identifier keys')
  }
  if (
    orphanStrategy !== 'discard' &&
    orphanStrategy !== 'root' &&
    orphanStrategy !== 'throw'
  ) {
    throw new TypeError('Invalid orphan strategy')
  }
}

function createBuildTreeEntries<
  T extends object,
  ChildrenKey extends PropertyKey,
>(
  nodes: readonly T[],
  childrenKey: ChildrenKey,
  idKey: keyof T,
  parentIdKey: keyof T,
): Map<TreeIdentifier, BuildTreeEntry<T, ChildrenKey>> {
  const entries = new Map<TreeIdentifier, BuildTreeEntry<T, ChildrenKey>>()

  for (const sourceNode of nodes) {
    const id: unknown = Reflect.get(sourceNode, idKey)
    const parentIdValue: unknown = Reflect.get(sourceNode, parentIdKey)

    if (!isTreeIdentifier(id)) {
      throw new TypeError('Node identifier must be a property key')
    }
    if (
      parentIdValue !== null &&
      parentIdValue !== undefined &&
      !isTreeIdentifier(parentIdValue)
    ) {
      throw new TypeError('Parent identifier must be a property key or nullish')
    }
    if (entries.has(id)) {
      throw new RangeError(`Duplicate tree identifier: ${String(id)}`)
    }

    const node = { ...sourceNode } as BuiltTreeNode<T, ChildrenKey>
    Reflect.set(node, childrenKey, [])
    entries.set(id, { id, node, parentId: parentIdValue })
  }

  return entries
}

function assertNoParentCycles<T, ChildrenKey extends PropertyKey>(
  entries: ReadonlyMap<TreeIdentifier, BuildTreeEntry<T, ChildrenKey>>,
  isRootParent: (parentId: TreeIdentifier | null | undefined) => boolean,
): void {
  const resolved = new Set<TreeIdentifier>()

  for (const entry of entries.values()) {
    const path = new Set<TreeIdentifier>()
    let current: BuildTreeEntry<T, ChildrenKey> | undefined = entry

    while (current && !resolved.has(current.id)) {
      if (path.has(current.id)) {
        throw new RangeError(
          `Tree parent cycle detected at identifier: ${String(current.id)}`,
        )
      }

      path.add(current.id)
      if (isRootParent(current.parentId)) {
        current = undefined
      } else {
        current =
          current.parentId === null || current.parentId === undefined
            ? undefined
            : entries.get(current.parentId)
      }
    }

    for (const id of path) {
      resolved.add(id)
    }
  }
}

function linkBuildTreeEntries<T, ChildrenKey extends PropertyKey>(
  entries: ReadonlyMap<TreeIdentifier, BuildTreeEntry<T, ChildrenKey>>,
  childrenKey: ChildrenKey,
  isRootParent: (parentId: TreeIdentifier | null | undefined) => boolean,
  orphanStrategy: BuildTreeOrphanStrategy,
): BuiltTreeNode<T, ChildrenKey>[] {
  const roots: BuiltTreeNode<T, ChildrenKey>[] = []

  for (const entry of entries.values()) {
    const parent =
      entry.parentId === null || entry.parentId === undefined
        ? undefined
        : entries.get(entry.parentId)

    if (isRootParent(entry.parentId)) {
      roots.push(entry.node)
    } else if (parent) {
      const children = Reflect.get(parent.node, childrenKey) as BuiltTreeNode<
        T,
        ChildrenKey
      >[]
      children.push(entry.node)
    } else if (orphanStrategy === 'root') {
      roots.push(entry.node)
    } else if (orphanStrategy === 'throw') {
      throw new RangeError(
        `Missing parent for tree identifier: ${String(entry.id)}`,
      )
    }
  }

  return roots
}

/**
 * Builds a tree from flat nodes without mutating the source array or nodes.
 *
 * Node and sibling order follows the source array. Duplicate identifiers and
 * parent cycles are rejected.
 *
 * @param nodes - Flat source nodes.
 * @param options - Identifier, child-key, root, and orphan options.
 * @returns Newly allocated tree nodes with child arrays.
 *
 * @example
 *
 * ```typescript
 * import { buildTree } from '@ntnyq/utils'
 *
 * const tree = buildTree([
 *   { id: 1, parentId: null, name: 'Root' },
 *   { id: 2, parentId: 1, name: 'Child' },
 * ])
 * console.log(tree[0]?.children[0]?.name) // => 'Child'
 * ```
 */
export function buildTree<
  T extends object,
  ChildrenKey extends PropertyKey = 'children',
>(
  nodes: readonly T[],
  options: BuildTreeOptions<T, ChildrenKey> = {},
): BuiltTreeNode<T, ChildrenKey>[] {
  const {
    childrenKey = 'children' as ChildrenKey,
    idKey = 'id' as keyof T,
    orphanStrategy = 'root',
    parentIdKey = 'parentId' as keyof T,
  } = options

  validateBuildTreeOptions(childrenKey, idKey, parentIdKey, orphanStrategy)

  const hasExplicitRoot = Object.hasOwn(options, 'rootParentId')
  const rootParentId = options.rootParentId
  const entries = createBuildTreeEntries(nodes, childrenKey, idKey, parentIdKey)

  const isRootParent = (
    parentId: TreeIdentifier | null | undefined,
  ): boolean =>
    hasExplicitRoot
      ? Object.is(parentId, rootParentId)
      : parentId === null || parentId === undefined

  assertNoParentCycles(entries, isRootParent)
  return linkBuildTreeEntries(
    entries,
    childrenKey,
    isRootParent,
    orphanStrategy,
  )
}
