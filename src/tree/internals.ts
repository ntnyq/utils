import type { TreeTraversalContext } from './types'

export function getTreeChildren<
  Node extends object,
  ChildrenKey extends keyof Node,
>(node: Node, childrenKey: ChildrenKey): readonly Node[] {
  const children = node[childrenKey] as unknown
  return Array.isArray(children) ? (children as readonly Node[]) : []
}

export function resolveChildrenKey<ChildrenKey extends PropertyKey>(
  childrenKey: ChildrenKey | undefined,
): ChildrenKey {
  return childrenKey ?? ('children' as ChildrenKey)
}

export function createTreeTraversalContext<Node>(
  node: Node,
  parent: Node | null,
  depth: number,
  index: number,
  path: readonly Node[],
): TreeTraversalContext<Node> {
  return {
    node,
    parent,
    depth,
    index,
    path: [...path],
  }
}
