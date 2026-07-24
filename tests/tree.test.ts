import { describe, expect, it, vi } from 'vitest'
import { buildTree, filterTree, findTreePath, flattenTree } from '../src/tree'

interface TreeNode {
  id: string
  children?: TreeNode[]
}

describe(buildTree, () => {
  it('should build a tree in source order without mutating flat nodes', () => {
    const nodes = [
      { id: 2, name: 'Child', parentId: 1 },
      { id: 1, name: 'Root', parentId: null },
      { id: 3, name: 'Second child', parentId: 1 },
    ]

    const result = buildTree(nodes)

    expect(result).toStrictEqual([
      {
        children: [
          { children: [], id: 2, name: 'Child', parentId: 1 },
          { children: [], id: 3, name: 'Second child', parentId: 1 },
        ],
        id: 1,
        name: 'Root',
        parentId: null,
      },
    ])
    expect(nodes).toStrictEqual([
      { id: 2, name: 'Child', parentId: 1 },
      { id: 1, name: 'Root', parentId: null },
      { id: 3, name: 'Second child', parentId: 1 },
    ])
  })

  it('should support custom keys and an explicit root parent identifier', () => {
    interface FlatNode {
      key: number
      label: string
      nodes?: string[]
      up: number
    }

    const nodes: FlatNode[] = [
      { key: 1, label: 'Root', nodes: ['stale'], up: 0 },
      { key: 2, label: 'Child', up: 1 },
    ]
    const result = buildTree(nodes, {
      childrenKey: 'nodes',
      idKey: 'key',
      parentIdKey: 'up',
      rootParentId: 0,
    })

    expect(result[0]?.nodes[0]?.label).toBe('Child')
    expect(nodes[0]?.nodes).toStrictEqual(['stale'])
  })

  it('should handle orphan nodes with explicit strategies', () => {
    const nodes = [{ id: 1, parentId: 99 }]

    expect(buildTree(nodes)).toHaveLength(1)
    expect(buildTree(nodes, { orphanStrategy: 'discard' })).toStrictEqual([])
    expect(() => buildTree(nodes, { orphanStrategy: 'throw' })).toThrow(
      RangeError,
    )
  })

  it('should reject duplicate identifiers and parent cycles', () => {
    expect(() =>
      buildTree([
        { id: 1, parentId: null },
        { id: 1, parentId: null },
      ]),
    ).toThrow(/Duplicate tree identifier/u)
    expect(() =>
      buildTree([
        { id: 1, parentId: 2 },
        { id: 2, parentId: 1 },
      ]),
    ).toThrow(/cycle/u)
  })

  it('should reject invalid keys and identifier values', () => {
    expect(() =>
      buildTree([{ id: {}, parentId: null }], { idKey: 'id' }),
    ).toThrow(TypeError)
    expect(() =>
      buildTree([{ id: 1, parentId: null }], { childrenKey: 'id' }),
    ).toThrow(TypeError)
  })
})

describe(filterTree, () => {
  it('should retain matching nodes and their cloned ancestor paths', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [
          { id: 'remove' },
          {
            id: 'branch',
            children: [{ id: 'keep' }, { id: 'remove-leaf' }],
          },
        ],
      },
    ]

    const result = filterTree(tree, ({ node }) => node.id === 'keep')

    expect(result).toStrictEqual([
      {
        id: 'root',
        children: [
          {
            id: 'branch',
            children: [{ id: 'keep' }],
          },
        ],
      },
    ])
    expect(result[0]).not.toBe(tree[0])
    expect(tree[0]?.children).toHaveLength(2)
  })

  it('should continue filtering descendants when a parent matches', () => {
    const tree: TreeNode[] = [
      { id: 'match', children: [{ id: 'not-a-match' }] },
    ]

    expect(filterTree(tree, ({ node }) => node.id === 'match')).toStrictEqual([
      { id: 'match', children: [] },
    ])
  })

  it('should support a custom children key and traversal context', () => {
    interface CustomNode {
      id: string
      nodes?: CustomNode[]
    }

    const contexts: string[] = []
    const tree: CustomNode[] = [{ id: 'root', nodes: [{ id: 'target' }] }]
    const result = filterTree(
      tree,
      ({ depth, index, node, parent, path }) => {
        contexts.push(
          `${node.id}:${parent?.id ?? 'none'}:${depth}:${index}:${path.length}`,
        )
        return node.id === 'target'
      },
      { childrenKey: 'nodes' },
    )

    expect(result[0]?.nodes?.[0]?.id).toBe('target')
    expect(contexts).toStrictEqual(['root:none:0:0:1', 'target:root:1:0:2'])
  })

  it('should reject circular child references', () => {
    const node: TreeNode = { id: 'loop' }
    node.children = [node]

    expect(() => filterTree([node], () => true)).toThrow(RangeError)
  })
})

describe(findTreePath, () => {
  it('should return the first depth-first path using original nodes', () => {
    const target: TreeNode = { id: 'target' }
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [{ id: 'left', children: [target] }, { id: 'target' }],
      },
    ]

    const path = findTreePath(tree, ({ node }) => node.id === 'target')

    expect(path?.map(node => node.id)).toStrictEqual(['root', 'left', 'target'])
    expect(path?.[2]).toBe(target)
  })

  it('should return undefined when no node matches', () => {
    expect(findTreePath([{ id: 'root' }], () => false)).toBeUndefined()
  })

  it('should support a custom children key and expose context', () => {
    interface CustomNode {
      id: string
      nodes?: CustomNode[]
    }

    const tree: CustomNode[] = [{ id: 'root', nodes: [{ id: 'target' }] }]
    const foundPath = findTreePath(
      tree,
      ({ depth, index, node, parent, path: nodePath }) =>
        node.id === 'target' &&
        parent?.id === 'root' &&
        depth === 1 &&
        index === 0 &&
        nodePath.length === 2,
      { childrenKey: 'nodes' },
    )

    expect(foundPath?.map(node => node.id)).toStrictEqual(['root', 'target'])
  })

  it('should reject circular child references', () => {
    const node: TreeNode = { id: 'loop' }
    node.children = [node]

    expect(() => findTreePath([node], () => false)).toThrow(RangeError)
  })
})

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
