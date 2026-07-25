---
title: Tree Utilities
outline: deep
---

# Tree Utilities

Helpers for constructing, traversing, filtering, searching, mapping, and
flattening tree-like data.

Traversal helpers use an explicit internal stack, so traversal depth does not
consume the JavaScript call stack.

This section documents 8 exported methods from the tree module.

## Methods

- [buildTree](#buildtree)
- [listToTree](#listtotree)
- [filterTree](#filtertree)
- [findTreeNode](#findtreenode)
- [findTreePath](#findtreepath)
- [flattenTree](#flattentree)
- [mapTree](#maptree)
- [walkTree](#walktree)

---

## buildTree

Builds cloned tree nodes from a flat list. It uses `id` and `parentId` by
default, writes generated child arrays to `children`, and preserves source
order.

Nullish parent identifiers are roots unless `rootParentId` is provided.
Unresolved parents become roots by default; `orphanStrategy` can instead be
`discard` or `throw`. Duplicate identifiers and parent cycles always throw.

```ts
import { buildTree } from '@ntnyq/utils'

const tree = buildTree([
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child' },
])

console.log(tree[0]?.children[0]?.name) // => 'Child'
```

Custom `idKey`, `parentIdKey`, and `childrenKey` values are supported.
Generated child properties are defined as own data properties, including for
special keys such as `__proto__`.

---

## listToTree

Builds cloned tree nodes with selector functions rather than property-key
options. It supports multiple root parent identifiers and configurable orphan
and cycle handling.

```ts
import { listToTree } from '@ntnyq/utils'

const tree = listToTree(departments, {
  childrenKey: 'nodes',
  getId: department => department.code,
  getParentId: department => department.parentCode,
  rootParentIds: [0],
})
```

Unresolved parents become roots by default. Set `orphanStrategy` to `discard`
or `throw`, and set `cycleStrategy: 'root'` to promote cycle members to roots
instead of throwing.

---

## filterTree

Returns a cloned tree containing matching nodes and their ancestor paths. A
matching parent does not automatically retain unmatched descendants. The
predicate receives the node, parent, depth, sibling index, and current path.
Each callback receives its own path snapshot.

```ts
import { filterTree } from '@ntnyq/utils'

const visible = filterTree(menuTree, ({ node }) =>
  grantedPermissions.has(node.permission),
)
```

Use `childrenKey` for trees whose child property is not `children`, or
`includeDescendants` to retain a matching node's complete subtree. Circular
child references throw by default and can be skipped with `onCycle: 'skip'`.

---

## findTreeNode

Returns the first node matching a depth-first predicate, or `undefined`. The
predicate receives the node, parent, depth, sibling index, and path snapshot.

```ts
import { findTreeNode } from '@ntnyq/utils'

const selected = findTreeNode(departments, ({ node }) => node.id === selectedId)
```

---

## findTreePath

Returns the first depth-first root-to-node path whose node matches the
predicate, or `undefined`. Path entries are the original node references.

```ts
import { findTreePath } from '@ntnyq/utils'

const path = findTreePath(departments, ({ node }) => node.id === selectedId)
console.log(path?.map(node => node.name))
```

The predicate receives the same traversal context as `filterTree`, and
`childrenKey` is configurable. Callback path snapshots cannot alter the
returned path or later traversal contexts.

---

## flattenTree

Flatten tree nodes into a one-dimensional array with depth-first pre-order traversal. If `options.map` is not provided, original nodes are returned.

### Parameters

- **roots**: Root nodes of the tree.
- **options**: Flatten options.

### Returns

Flattened nodes.

### Example

```ts
import { flattenTree } from '@ntnyq/utils'

const tree = [{ id: 1, children: [{ id: 2, children: [] }] }]
const result = flattenTree(tree)
console.log(result.map(item => item.id)) // => [1, 2]
```

Circular child references throw a `TypeError`.

---

## mapTree

Maps a tree from the leaves upward without mutating its source. The mapper
receives already-mapped children, so the output can use a different node shape
or child property.

```ts
import { mapTree } from '@ntnyq/utils'

const options = mapTree(tree, ({ node, children }) => ({
  label: node.name,
  value: node.id,
  options: children,
}))
```

---

## walkTree

Walks tree nodes in depth-first preorder. Return `skip` to omit the current
node's descendants, or `stop` to end the entire traversal.

```ts
import { walkTree } from '@ntnyq/utils'

const result = walkTree(tree, ({ node }) => {
  if (node.disabled) {
    return 'skip'
  }
  console.log(node.id)
})

console.log(result.visitedCount)
```

Custom child keys and `onCycle: 'skip'` are supported.
