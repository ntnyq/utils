export interface TreeTraversalContext<T> {
  node: T
  parent: T | null
  depth: number
  /**
   * Index of the current node in its level, starting from 0.
   */
  index: number
  /**
   * Root-to-node path snapshot for the current callback.
   */
  path: T[]
}
