import { describe, expect, it, vi } from 'vitest'
import { flattenTree } from '../src/tree'

interface TreeNode {
  id: string
  children?: TreeNode[]
}

describe(flattenTree, () => {
  it('should flatten tree in preorder by default', () => {
    const tree: TreeNode[] = [
      {
        id: 'a',
        children: [{ id: 'a-1' }, { id: 'a-2', children: [{ id: 'a-2-1' }] }],
      },
      { id: 'b' },
    ]

    const result = flattenTree(tree)

    expect(result.map(node => node.id)).toStrictEqual([
      'a',
      'a-1',
      'a-2',
      'a-2-1',
      'b',
    ])
  })

  it('should return empty array for empty roots', () => {
    expect(flattenTree([])).toStrictEqual([])
  })

  it('should not include nodes when includeSelf is false', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [{ id: 'child-1' }, { id: 'child-2' }],
      },
    ]

    const result = flattenTree(tree, { includeSelf: false })

    expect(result).toStrictEqual([])
  })

  it('should support custom children key', () => {
    interface CustomNode {
      id: string
      nodes?: CustomNode[]
    }

    const tree: CustomNode[] = [
      {
        id: 'x',
        nodes: [{ id: 'x-1' }, { id: 'x-2', nodes: [{ id: 'x-2-1' }] }],
      },
    ]

    const result = flattenTree(tree, { childrenKey: 'nodes' })

    expect(result.map(node => node.id)).toStrictEqual([
      'x',
      'x-1',
      'x-2',
      'x-2-1',
    ])
  })

  it('should ignore non-array children', () => {
    const tree = [
      { id: 'a', children: null },
      { id: 'b', children: { id: 'b-1' } },
      { id: 'c', children: 'not-array' },
    ] as unknown as TreeNode[]

    const result = flattenTree(tree)

    expect(result.map(node => node.id)).toStrictEqual(['a', 'b', 'c'])
  })

  it('should map each node with complete traversal context', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [
          { id: 'left' },
          { id: 'right', children: [{ id: 'right-leaf' }] },
        ],
      },
    ]

    const result = flattenTree(tree, {
      map: ({ node, parent, depth, index, path }) => ({
        id: node.id,
        parentId: parent?.id ?? null,
        depth,
        index,
        pathIds: path.map(item => item.id),
      }),
    })

    expect(result).toStrictEqual([
      {
        id: 'root',
        parentId: null,
        depth: 0,
        index: 0,
        pathIds: ['root'],
      },
      {
        id: 'left',
        parentId: 'root',
        depth: 1,
        index: 0,
        pathIds: ['root', 'left'],
      },
      {
        id: 'right',
        parentId: 'root',
        depth: 1,
        index: 1,
        pathIds: ['root', 'right'],
      },
      {
        id: 'right-leaf',
        parentId: 'right',
        depth: 2,
        index: 0,
        pathIds: ['root', 'right', 'right-leaf'],
      },
    ])
  })

  it('should run map only for included nodes', () => {
    const map = vi.fn(({ node }: { node: TreeNode }) => node.id)
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [{ id: 'child' }],
      },
    ]

    const result = flattenTree(tree, {
      includeSelf: false,
      map,
    })

    expect(result).toStrictEqual([])
    expect(map).not.toHaveBeenCalled()
  })
})
