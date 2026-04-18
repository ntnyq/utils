---
title: Tree Utilities
outline: deep
---

# Tree Utilities

Helpers for flattening nested tree-like data structures.

This section documents 1 exported method from the tree module.

## Methods

- [flatTree](#flattree)

---

## flatTree

Flatten tree nodes into a one-dimensional array with depth-first pre-order traversal. If `options.map` is not provided, original nodes are returned.

### Parameters

- **roots**: Root nodes of the tree.
- **options**: Flatten options.

### Returns

Flattened nodes.

### Example

```ts
import { flatTree } from '@ntnyq/utils'

const tree = [{ id: 1, children: [{ id: 2, children: [] }] }]
const result = flatTree(tree)
console.log(result.map(item => item.id)) // => [1, 2]
```
