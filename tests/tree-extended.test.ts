import { describe, expect, it } from 'vitest'
import {
  filterTree,
  findTreeNode,
  findTreePath,
  listToTree,
  mapTree,
  walkTree,
} from '../src/tree'

interface TreeNode {
  id: string
  children?: TreeNode[]
}

describe(listToTree, () => {
  it('should build an immutable tree with default id keys', () => {
    const items = [
      { id: 'child', parentId: 'root', label: 'Child' },
      { id: 'root', parentId: null, label: 'Root' },
      { id: 'orphan', parentId: 'missing', label: 'Orphan' },
    ] as const

    const result = listToTree(items)

    expect(result).toStrictEqual([
      {
        id: 'root',
        parentId: null,
        label: 'Root',
        children: [
          {
            id: 'child',
            parentId: 'root',
            label: 'Child',
            children: [],
          },
        ],
      },
      {
        id: 'orphan',
        parentId: 'missing',
        label: 'Orphan',
        children: [],
      },
    ])
    expect(result[0]).not.toBe(items[1])
    expect(items).toStrictEqual([
      { id: 'child', parentId: 'root', label: 'Child' },
      { id: 'root', parentId: null, label: 'Root' },
      { id: 'orphan', parentId: 'missing', label: 'Orphan' },
    ])
  })

  it('should support typed selectors, custom children keys, and root ids', () => {
    interface Department {
      code: number
      name: string
      parentCode: number
    }

    const items: Department[] = [
      { code: 2, name: 'Engineering', parentCode: 1 },
      { code: 1, name: 'Company', parentCode: 0 },
      { code: 3, name: 'Orphan', parentCode: 99 },
      { code: 4, name: 'Orphan child', parentCode: 3 },
    ]
    const result = listToTree(items, {
      childrenKey: 'nodes',
      getId: item => item.code,
      getParentId: item => item.parentCode,
      orphanStrategy: 'discard',
      rootParentIds: [0],
    })

    expect(result).toStrictEqual([
      {
        code: 1,
        name: 'Company',
        parentCode: 0,
        nodes: [
          {
            code: 2,
            name: 'Engineering',
            parentCode: 1,
            nodes: [],
          },
        ],
      },
    ])
  })

  it('should reject duplicate identifiers and configurable invalid relations', () => {
    expect(() =>
      listToTree([
        { id: 'duplicate', parentId: null },
        { id: 'duplicate', parentId: null },
      ]),
    ).toThrow(TypeError)

    expect(() =>
      listToTree([{ id: 'orphan', parentId: 'missing' }], {
        orphanStrategy: 'throw',
      }),
    ).toThrow(TypeError)

    const cycle = [
      { id: 'a', parentId: 'b' },
      { id: 'b', parentId: 'a' },
    ]
    expect(() => listToTree(cycle)).toThrow(TypeError)
    expect(listToTree(cycle, { cycleStrategy: 'root' })).toStrictEqual([
      { id: 'a', parentId: 'b', children: [] },
      { id: 'b', parentId: 'a', children: [] },
    ])
  })
})

describe(walkTree, () => {
  it('should walk in preorder with complete context and traversal control', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [
          { id: 'skip', children: [{ id: 'skipped-child' }] },
          { id: 'right' },
        ],
      },
      { id: 'stop' },
      { id: 'not-visited' },
    ]
    const visited: {
      depth: number
      id: string
      index: number
      parentId: string | null
      path: string[]
    }[] = []

    const result = walkTree(tree, ({ node, parent, depth, index, path }) => {
      visited.push({
        depth,
        id: node.id,
        index,
        parentId: parent?.id ?? null,
        path: path.map(pathNode => pathNode.id),
      })

      if (node.id === 'skip') {
        return 'skip'
      }
      if (node.id === 'stop') {
        return 'stop'
      }
      return undefined
    })

    expect(visited).toStrictEqual([
      {
        depth: 0,
        id: 'root',
        index: 0,
        parentId: null,
        path: ['root'],
      },
      {
        depth: 1,
        id: 'skip',
        index: 0,
        parentId: 'root',
        path: ['root', 'skip'],
      },
      {
        depth: 1,
        id: 'right',
        index: 1,
        parentId: 'root',
        path: ['root', 'right'],
      },
      {
        depth: 0,
        id: 'stop',
        index: 1,
        parentId: null,
        path: ['stop'],
      },
    ])
    expect(result).toStrictEqual({
      isStopped: true,
      stoppedNode: tree[1],
      visitedCount: 4,
    })
  })

  it('should support custom children keys and cycle strategies', () => {
    interface CustomNode {
      id: string
      nodes?: CustomNode[]
    }

    const root: CustomNode = { id: 'root' }
    root.nodes = [{ id: 'child', nodes: [root] }]
    const visited: string[] = []

    const result = walkTree(
      [root],
      ({ node }) => {
        visited.push(node.id)
      },
      {
        childrenKey: 'nodes',
        onCycle: 'skip',
      },
    )

    expect(visited).toStrictEqual(['root', 'child'])
    expect(result).toStrictEqual({
      isStopped: false,
      stoppedNode: undefined,
      visitedCount: 2,
    })
    expect(() =>
      walkTree([root], () => undefined, { childrenKey: 'nodes' }),
    ).toThrow(TypeError)
  })
})

describe('tree queries', () => {
  it('should find a node and its path with predicate context', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [
          { id: 'left' },
          { id: 'right', children: [{ id: 'target' }] },
        ],
      },
    ]

    const node = findTreeNode(
      tree,
      ({ node: currentNode, parent, depth }) =>
        currentNode.id === 'target' && parent?.id === 'right' && depth === 2,
    )
    const path = findTreePath(
      tree,
      ({ node: currentNode }) => currentNode.id === 'target',
    )

    expect(node).toBe(tree[0]?.children?.[1]?.children?.[0])
    expect(path?.map(pathNode => pathNode.id)).toStrictEqual([
      'root',
      'right',
      'target',
    ])
  })

  it('should return undefined when no node matches', () => {
    const tree: TreeNode[] = [{ id: 'root' }]

    expect(
      findTreeNode(tree, ({ node }) => node.id === 'missing'),
    ).toBeUndefined()
    expect(
      findTreePath(tree, ({ node }) => node.id === 'missing'),
    ).toBeUndefined()
  })
})

describe(mapTree, () => {
  it('should map nodes and mapped children to an arbitrary output type', () => {
    const tree: TreeNode[] = [
      {
        id: 'root',
        children: [{ id: 'left' }, { id: 'right', children: [{ id: 'leaf' }] }],
      },
    ]

    const result = mapTree(tree, ({ node, depth, children }) => ({
      key: node.id,
      level: depth,
      nodes: children,
    }))

    expect(result).toStrictEqual([
      {
        key: 'root',
        level: 0,
        nodes: [
          {
            key: 'left',
            level: 1,
            nodes: [],
          },
          {
            key: 'right',
            level: 1,
            nodes: [
              {
                key: 'leaf',
                level: 2,
                nodes: [],
              },
            ],
          },
        ],
      },
    ])
    expect(tree[0]?.children?.[1]?.children?.[0]?.id).toBe('leaf')
  })
})

describe('filterTree extended options', () => {
  interface FilterNode {
    id: string
    isAllowed?: boolean
    children?: FilterNode[]
  }

  const tree: FilterNode[] = [
    {
      id: 'root',
      children: [
        {
          id: 'matched',
          isAllowed: true,
          children: [{ id: 'unmatched-descendant' }],
        },
        {
          id: 'ancestor',
          children: [{ id: 'nested-match', isAllowed: true }],
        },
        { id: 'removed' },
      ],
    },
  ]

  it('should keep matches and their ancestors without mutating the source', () => {
    const result = filterTree(tree, ({ node }) => node.isAllowed === true)

    expect(result).toStrictEqual([
      {
        id: 'root',
        children: [
          {
            id: 'matched',
            isAllowed: true,
            children: [],
          },
          {
            id: 'ancestor',
            children: [{ id: 'nested-match', isAllowed: true }],
          },
        ],
      },
    ])
    expect(result[0]).not.toBe(tree[0])
    expect(tree[0]?.children).toHaveLength(3)
    expect(tree[0]?.children?.[0]?.children).toStrictEqual([
      { id: 'unmatched-descendant' },
    ])
  })

  it('should keep complete matching subtrees when configured', () => {
    const result = filterTree(tree, ({ node }) => node.id === 'matched', {
      includeDescendants: true,
    })

    expect(result[0]?.children).toStrictEqual([
      {
        id: 'matched',
        isAllowed: true,
        children: [{ id: 'unmatched-descendant' }],
      },
    ])
  })
})
