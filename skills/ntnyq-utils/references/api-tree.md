# Tree

Source: `docs/api/tree.md`, `src/tree/`, `tests/tree.test.ts`,
`tests/tree-extended.test.ts`, and tree API type tests.

## Build from Flat Data

```ts
import { buildTree, findTreePath } from '@ntnyq/utils'

const tree = buildTree([
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child' },
])
const path = findTreePath(tree, ({ node }) => node.id === 2)
// path?.map(node => node.name) is ['Root', 'Child']
```

`buildTree(items, options)` clones nodes and preserves source order. Defaults
are `idKey: 'id'`, `parentIdKey: 'parentId'`, and `childrenKey: 'children'`.
Nullish parent IDs designate roots unless `rootParentId` is supplied.
Unknown parents become roots; `orphanStrategy` can be `'discard'` or `'throw'`.
Duplicate IDs and parent cycles throw.

Use `listToTree(items, { getId, getParentId, ...options })` when keys need
selectors. It supports `rootParentIds` for multiple root markers, custom
`childrenKey`, and `cycleStrategy: 'root'` to promote cycle members to roots.
Its default cycle strategy throws.

## Traverse and Transform

Callbacks receive a context object, not the node alone. Traversal context
includes `node`, `parent`, `depth`, `index` (sibling index), and `path`.
Path snapshots are independent. Custom child names use `childrenKey`.

| API                                       | Behavior                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `findTreeNode(roots, predicate, options)` | First depth-first match or `undefined`; returns the original node                     |
| `findTreePath(roots, predicate, options)` | First matching root-to-node path or `undefined`; original node references             |
| `filterTree(roots, predicate, options)`   | Cloned matches plus their ancestor paths                                              |
| `mapTree(roots, mapper, options)`         | Bottom-up mapping; context includes already-mapped `children`                         |
| `flattenTree(roots, options)`             | Depth-first preorder; original nodes unless `options.map` is supplied                 |
| `walkTree(roots, visitor, options)`       | Depth-first preorder; return `'skip'` for descendants or `'stop'` for the entire walk |

`filterTree` does not keep unmatched descendants of matching nodes unless
`includeDescendants: true` is set. `mapTree` lets the mapper choose the output
shape, including the name of the child property:

```ts
import { mapTree } from '@ntnyq/utils'

const options = mapTree(
  [{ id: 1, name: 'Root', children: [] }],
  ({ node, children }) => ({
    label: node.name,
    value: node.id,
    options: children,
  }),
)
```

Traversal uses an explicit stack for deep trees. Circular child paths throw
by default. `filterTree`, `findTreeNode`, `findTreePath`, `mapTree`, and
`walkTree` support `onCycle: 'skip'`; `flattenTree` always throws on cycles.
`walkTree` returns traversal metadata including `visitedCount`.
