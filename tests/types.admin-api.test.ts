import { describe, expectTypeOf, it } from 'vitest'
import {
  buildTree,
  filterTree,
  findTreePath,
  keyBy,
  mapAsync,
  orderBy,
} from '../src'
import type {
  BuildTreeOptions,
  BuiltTreeNode,
  FilterTreeOptions,
  FindTreePathOptions,
  MapAsyncMapper,
  MapAsyncOptions,
  OrderByOptions,
  OrderBySelector,
  OrderByValue,
  TreeTraversalContext,
} from '../src'

describe('admin utility public API types', () => {
  it('should infer tree, indexing, ordering, and async utility results', () => {
    interface FlatNode {
      id: number
      name: string
      parentId: number | null
    }
    interface TreeNode {
      children?: TreeNode[]
      id: number
    }

    const flatNodes: FlatNode[] = [{ id: 1, name: 'Root', parentId: null }]
    const built = buildTree(flatNodes)
    const tree: TreeNode[] = [{ id: 1, children: [] }]
    const filtered = filterTree(tree, ({ node }) => node.id === 1)
    const path = findTreePath(tree, ({ node }) => node.id === 1)
    const indexed = keyBy(
      [
        { id: 'a' as const, value: 1 },
        { id: 'b' as const, value: 2 },
      ],
      'id',
    )
    const ordered = orderBy(tree, 'id')
    const mapped = mapAsync([1, 2], String)

    expectTypeOf(built).toEqualTypeOf<BuiltTreeNode<FlatNode>[]>()
    expectTypeOf(filtered).toEqualTypeOf<TreeNode[]>()
    expectTypeOf(path).toEqualTypeOf<TreeNode[] | undefined>()
    expectTypeOf(indexed).toMatchTypeOf<
      Partial<Record<'a' | 'b', { id: 'a' | 'b'; value: number }>>
    >()
    expectTypeOf(ordered).toEqualTypeOf<TreeNode[]>()
    expectTypeOf(mapped).toEqualTypeOf<Promise<string[]>>()
  })

  it('should export public functions and supporting types', () => {
    interface TreeNode {
      children?: TreeNode[]
    }

    expectTypeOf<BuildTreeOptions<{ id: number }, 'children'>>().toBeObject()
    expectTypeOf<FilterTreeOptions<TreeNode, 'children'>>().toBeObject()
    expectTypeOf<FindTreePathOptions<TreeNode, 'children'>>().toBeObject()
    expectTypeOf<MapAsyncMapper<number, string>>().toBeFunction()
    expectTypeOf<MapAsyncOptions>().toBeObject()
    expectTypeOf<OrderByOptions>().toBeObject()
    expectTypeOf<OrderBySelector<{ id: number }>>().toEqualTypeOf<
      'id' | ((item: { id: number }) => OrderByValue)
    >()
    expectTypeOf<TreeTraversalContext<TreeNode>>().toBeObject()
    expectTypeOf(buildTree).toBeFunction()
    expectTypeOf(filterTree).toBeFunction()
    expectTypeOf(findTreePath).toBeFunction()
    expectTypeOf(keyBy).toBeFunction()
    expectTypeOf(mapAsync).toBeFunction()
    expectTypeOf(orderBy).toBeFunction()
  })

  it('should reject non-identifier build keys and non-comparable sort keys', () => {
    interface InvalidTreeNode {
      id: { nested: true }
      parentId: null
    }
    interface InvalidSortRow {
      metadata: object
    }

    const invalidTreeOptions: BuildTreeOptions<InvalidTreeNode> = {
      // @ts-expect-error identifiers must resolve to property keys
      idKey: 'id',
    }

    // @ts-expect-error property-key selectors must resolve to comparable values
    orderBy([] as InvalidSortRow[], 'metadata')
    expectTypeOf(invalidTreeOptions).toBeObject()
  })
})
