import { buildFlatTree } from './buildFlatTree'
import type { FlatTreeNode } from './buildFlatTree'

export type TreeIdentifier = string | number | symbol
export type BuildTreeOrphanStrategy = 'discard' | 'root' | 'throw'

type TreeIdentifierKeyOf<T> = {
  [Key in keyof T]-?: Exclude<T[Key], null | undefined> extends TreeIdentifier
    ? Key
    : never
}[keyof T]

export type BuiltTreeNode<
  T,
  ChildrenKey extends PropertyKey = 'children',
> = FlatTreeNode<T, ChildrenKey>

export interface BuildTreeOptions<
  T extends object,
  ChildrenKey extends PropertyKey = 'children',
> {
  /**
   * Property containing the unique node identifier.
   *
   * @default `id`
   */
  idKey?: TreeIdentifierKeyOf<T>

  /**
   * Property containing the parent identifier.
   *
   * @default `parentId`
   */
  parentIdKey?: TreeIdentifierKeyOf<T>

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

function validateBuildTreeOptions<T extends object>(
  childrenKey: PropertyKey,
  idKey: TreeIdentifierKeyOf<T>,
  parentIdKey: TreeIdentifierKeyOf<T>,
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
    idKey = 'id' as TreeIdentifierKeyOf<T>,
    orphanStrategy = 'root',
    parentIdKey = 'parentId' as TreeIdentifierKeyOf<T>,
  } = options

  validateBuildTreeOptions(childrenKey, idKey, parentIdKey, orphanStrategy)

  const hasExplicitRoot = Object.hasOwn(options, 'rootParentId')
  const rootParentId = options.rootParentId

  return buildFlatTree(nodes, {
    childrenKey,
    cloneStrategy: 'enumerable',
    cycleStrategy: 'throw',
    errorMode: 'buildTree',
    getId: node => Reflect.get(node, idKey),
    getParentId: node => Reflect.get(node, parentIdKey),
    orphanStrategy,
    rootParentIds: hasExplicitRoot ? [rootParentId] : [null, undefined],
  })
}
