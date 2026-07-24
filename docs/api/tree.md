---
title: Tree Utilities
outline: deep
---

# Tree Utilities

Helpers for constructing, filtering, searching, and flattening tree-like data.

This section documents 4 exported methods from the tree module.

## Methods

- [buildTree](#buildtree)
- [filterTree](#filtertree)
- [findTreePath](#findtreepath)
- [flattenTree](#flattentree)

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

Use `childrenKey` for trees whose child property is not `children`. Circular
child references throw.

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
