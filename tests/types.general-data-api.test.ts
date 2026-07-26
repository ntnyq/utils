import { describe, expectTypeOf, it } from 'vitest'
import {
  filterTree,
  findTreeNode,
  listToTree,
  mapTree,
  moveArrayItem,
  safeParse,
  safeStringify,
  validateFile,
  walkTree,
} from '../src'
import type {
  FileValidationIssue,
  ListToTreeNode,
  ListToTreeOptions,
  MapTreeContext,
  JsonValue,
  SafeParseOptions,
  SafeParseResult,
  SafeStringifyOptions,
  TreeTraversalOptions,
  ValidateFileOptions,
  ValidateFileResult,
  WalkTreeResult,
} from '../src'

function inferFileValidation(file: File) {
  return validateFile<File, 'blocked-content'>(file, {
    rules: [
      () => ({
        code: 'blocked-content',
      }),
    ],
  })
}

describe('general data utility public API types', () => {
  it('should infer immutable array and tree transformations', () => {
    interface Department {
      code: number
      name: string
      parentCode: number
    }
    interface MappedDepartment {
      code: number
      nodes: MappedDepartment[]
    }

    const departments: Department[] = [
      { code: 1, name: 'Company', parentCode: 0 },
    ]
    const moved = moveArrayItem(departments, 0, 0)
    const tree = listToTree(departments, {
      childrenKey: 'nodes',
      getId: department => department.code,
      getParentId: department => department.parentCode,
      rootParentIds: [0],
    })
    const mapped = mapTree<
      ListToTreeNode<Department, 'nodes'>,
      MappedDepartment,
      'nodes'
    >(
      tree,
      ({ node, children }) => ({
        code: node.code,
        nodes: children,
      }),
      { childrenKey: 'nodes' },
    )

    expectTypeOf(moved).toEqualTypeOf<Department[]>()
    expectTypeOf(tree).toEqualTypeOf<ListToTreeNode<Department, 'nodes'>[]>()
    expectTypeOf(mapped).toEqualTypeOf<MappedDepartment[]>()
  })

  it('should expose traversal functions and supporting types', () => {
    interface TreeNode {
      children?: TreeNode[]
      id: number
    }

    const tree: TreeNode[] = [{ id: 1 }]
    const walked = walkTree(tree, () => undefined)
    const found = findTreeNode(tree, ({ node }) => node.id === 1)
    const filtered = filterTree(tree, ({ node }) => node.id === 1, {
      includeDescendants: true,
      onCycle: 'skip',
    })

    expectTypeOf(walked).toEqualTypeOf<WalkTreeResult<TreeNode>>()
    expectTypeOf(found).toEqualTypeOf<TreeNode | undefined>()
    expectTypeOf(filtered).toEqualTypeOf<TreeNode[]>()
    expectTypeOf<TreeTraversalOptions<TreeNode, 'children'>>().toBeObject()
    expectTypeOf<MapTreeContext<TreeNode, { id: number }>>().toBeObject()
    expectTypeOf<ListToTreeOptions<TreeNode, number, 'children'>>().toBeObject()
  })

  it('should expose serialization and file validation contracts', () => {
    const parsed = safeParse('{"value":1}')
    const revived = safeParse('{"value":1}', {
      reviver: (_key, value) => value,
    })

    expectTypeOf(parsed).toEqualTypeOf<SafeParseResult<JsonValue>>()
    expectTypeOf(revived).toEqualTypeOf<SafeParseResult<unknown>>()
    expectTypeOf<SafeParseOptions>().toBeObject()
    expectTypeOf(safeStringify({ value: 1n })).toEqualTypeOf<string>()
    expectTypeOf<SafeStringifyOptions>().toBeObject()
    expectTypeOf<ValidateFileOptions<File, 'blocked-content'>>().toBeObject()
    expectTypeOf<FileValidationIssue<'blocked-content'>>().toBeObject()
    expectTypeOf(inferFileValidation).returns.toEqualTypeOf<
      ValidateFileResult<
        File,
        | 'blocked-content'
        | 'file-too-large'
        | 'file-too-small'
        | 'invalid-extension'
        | 'invalid-mime-type'
      >
    >()
    expectTypeOf(validateFile).toBeFunction()
  })
})
