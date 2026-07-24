export type TreeCycleStrategy = 'skip' | 'throw'

export interface TreeTraversalContext<Node> {
  node: Node
  parent: Node | null
  depth: number

  /**
   * Index of the current node in its level, starting from 0.
   */
  index: number

  /**
   * Root-to-node path snapshot for the current callback.
   */
  path: Node[]
}

export interface TreeTraversalOptions<
  Node,
  ChildrenKey extends keyof Node = keyof Node,
> {
  /**
   * Property containing child nodes.
   *
   * @default 'children'
   */
  childrenKey?: ChildrenKey

  /**
   * Behavior when a node references one of its ancestors.
   *
   * @default 'throw'
   */
  onCycle?: TreeCycleStrategy
}
