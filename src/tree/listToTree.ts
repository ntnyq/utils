import { buildFlatTree } from './buildFlatTree'
import type { FlatTreeNode } from './buildFlatTree'

export type ListToTreeCycleStrategy = 'root' | 'throw'
export type ListToTreeOrphanStrategy = 'discard' | 'root' | 'throw'

export type ListToTreeNode<
  Item extends object,
  ChildrenKey extends PropertyKey,
> = FlatTreeNode<Item, ChildrenKey>

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

  return buildFlatTree(items, {
    childrenKey,
    cloneStrategy: 'descriptors',
    cycleStrategy,
    errorMode: 'listToTree',
    getId,
    getParentId,
    orphanStrategy,
    rootParentIds,
  })
}
