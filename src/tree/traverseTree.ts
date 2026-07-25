// oxlint-disable max-params, no-continue

import { getTreeChildren, resolveChildrenKey } from './internals'
import type { TreeTraversalContext, TreeTraversalOptions } from './types'

export type TreeTraverseControl = 'continue' | 'skip' | 'stop' | undefined

export type TreeTraverseVisitor<Node> = (
  context: TreeTraversalContext<Node>,
  resolvePath: () => Node[],
) => TreeTraverseControl

export interface TreeTraverseResult<Node> {
  isStopped: boolean
  stoppedNode: Node | undefined
  visitedCount: number
}

/**
 * Marker returned by a fold visitor to omit the current node from its output.
 */
export const TREE_FOLD_SKIP: unique symbol = Symbol('TREE_FOLD_SKIP')

export type TreeFoldResult<Result> = Result | typeof TREE_FOLD_SKIP

export interface TreeFoldVisitor<Node, Result, State> {
  enter?: (context: TreeTraversalContext<Node>, parentState: State) => State
  leave: (
    context: TreeTraversalContext<Node>,
    children: Result[],
    state: State,
  ) => TreeFoldResult<Result>
}

interface TreePathLink<Node> {
  node: Node
  parent: TreePathLink<Node> | null
}

interface TreeEnterFrame<Node> {
  depth: number
  index: number
  node: Node
  parent: Node | null
  parentPath: TreePathLink<Node> | null
  phase: 'enter'
}

interface TreeLeaveFrame<Node> {
  node: Node
  phase: 'leave'
}

type TreeFrame<Node> = TreeEnterFrame<Node> | TreeLeaveFrame<Node>

interface TreeFoldEnterFrame<Node, Result, State> extends TreeEnterFrame<Node> {
  output: Result[]
  parentState: State
}

interface TreeFoldLeaveFrame<Node, Result, State> {
  children: Result[]
  context: TreeTraversalContext<Node>
  node: Node
  output: Result[]
  phase: 'leave'
  state: State
}

type TreeFoldFrame<Node, Result, State> =
  | TreeFoldEnterFrame<Node, Result, State>
  | TreeFoldLeaveFrame<Node, Result, State>

function createTreePath<Node>(
  node: Node,
  parent: TreePathLink<Node> | null,
): TreePathLink<Node> {
  return {
    node,
    parent,
  }
}

function toTreePath<Node>(path: TreePathLink<Node>): Node[] {
  const nodes: Node[] = []
  let currentPath: TreePathLink<Node> | null = path

  while (currentPath) {
    nodes.push(currentPath.node)
    currentPath = currentPath.parent
  }

  return nodes.reverse()
}

function createTraversalContext<Node>(
  node: Node,
  parent: Node | null,
  depth: number,
  index: number,
  path: TreePathLink<Node>,
): TreeTraversalContext<Node> {
  let pathSnapshot: Node[] | undefined

  return {
    depth,
    index,
    node,
    parent,
    get path(): Node[] {
      pathSnapshot ??= toTreePath(path)
      return pathSnapshot
    },
    set path(nextPath: Node[]) {
      pathSnapshot = nextPath
    },
  }
}

function pushTreeEntries<Node extends object>(
  stack: TreeFrame<Node>[],
  nodes: readonly Node[],
  parent: Node | null,
  depth: number,
  parentPath: TreePathLink<Node> | null,
): void {
  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index]
    if (node) {
      stack.push({
        depth,
        index,
        node,
        parent,
        parentPath,
        phase: 'enter',
      })
    }
  }
}

function pushTreeFoldEntries<Node extends object, Result, State>(
  stack: TreeFoldFrame<Node, Result, State>[],
  nodes: readonly Node[],
  parent: Node | null,
  depth: number,
  parentPath: TreePathLink<Node> | null,
  parentState: State,
  output: Result[],
): void {
  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index]
    if (node) {
      stack.push({
        depth,
        index,
        node,
        output,
        parent,
        parentPath,
        parentState,
        phase: 'enter',
      })
    }
  }
}

/**
 * Traverses tree nodes iteratively in depth-first preorder.
 *
 * The visitor may skip descendants or stop traversal, while cycle handling is
 * controlled through the traversal options.
 *
 * @param roots - Root nodes to traverse.
 * @param visitor - Called once for each visited node.
 * @param options - Child-key and cycle options.
 * @param createCycleError - Creates the caller-specific cycle error.
 * @returns Traversal status and visit count.
 */
export function traverseTree<
  Node extends object,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  visitor: TreeTraverseVisitor<Node>,
  options: TreeTraversalOptions<Node, ChildrenKey>,
  createCycleError: () => Error,
): TreeTraverseResult<Node> {
  const childrenKey = resolveChildrenKey(options.childrenKey)
  const { onCycle = 'throw' } = options
  const activeNodes = new Set<Node>()
  const stack: TreeFrame<Node>[] = []
  let visitedCount = 0

  pushTreeEntries(stack, roots, null, 0, null)

  while (stack.length > 0) {
    const frame = stack.pop()
    if (!frame) {
      break
    }

    if (frame.phase === 'leave') {
      activeNodes.delete(frame.node)
      continue
    }

    if (activeNodes.has(frame.node)) {
      if (onCycle === 'throw') {
        throw createCycleError()
      }
      continue
    }

    const path = createTreePath(frame.node, frame.parentPath)
    activeNodes.add(frame.node)
    visitedCount++

    const control = visitor(
      createTraversalContext(
        frame.node,
        frame.parent,
        frame.depth,
        frame.index,
        path,
      ),
      () => toTreePath(path),
    )
    if (control === 'stop') {
      return {
        isStopped: true,
        stoppedNode: frame.node,
        visitedCount,
      }
    }

    stack.push({
      node: frame.node,
      phase: 'leave',
    })

    if (control !== 'skip') {
      pushTreeEntries(
        stack,
        getTreeChildren(frame.node, childrenKey),
        frame.node,
        frame.depth + 1,
        path,
      )
    }
  }

  return {
    isStopped: false,
    stoppedNode: undefined,
    visitedCount,
  }
}

/**
 * Folds tree nodes iteratively in depth-first postorder.
 *
 * State flows from parents to children, and each leave callback receives the
 * already-folded child results.
 *
 * @param roots - Root nodes to fold.
 * @param visitor - Enter and leave callbacks for each node.
 * @param rootState - State supplied to each root node.
 * @param options - Child-key and cycle options.
 * @param createCycleError - Creates the caller-specific cycle error.
 * @returns Folded root results.
 */
export function foldTree<
  Node extends object,
  Result,
  State,
  ChildrenKey extends keyof Node = keyof Node,
>(
  roots: readonly Node[],
  visitor: TreeFoldVisitor<Node, Result, State>,
  rootState: State,
  options: TreeTraversalOptions<Node, ChildrenKey>,
  createCycleError: () => Error,
): Result[] {
  const childrenKey = resolveChildrenKey(options.childrenKey)
  const { onCycle = 'throw' } = options
  const activeNodes = new Set<Node>()
  const results: Result[] = []
  const stack: TreeFoldFrame<Node, Result, State>[] = []

  pushTreeFoldEntries(stack, roots, null, 0, null, rootState, results)

  while (stack.length > 0) {
    const frame = stack.pop()
    if (!frame) {
      break
    }

    if (frame.phase === 'leave') {
      activeNodes.delete(frame.node)
      const result = visitor.leave(frame.context, frame.children, frame.state)
      if (result !== TREE_FOLD_SKIP) {
        frame.output.push(result)
      }
      continue
    }

    if (activeNodes.has(frame.node)) {
      if (onCycle === 'throw') {
        throw createCycleError()
      }
      continue
    }

    const path = createTreePath(frame.node, frame.parentPath)
    const context = createTraversalContext(
      frame.node,
      frame.parent,
      frame.depth,
      frame.index,
      path,
    )
    const state = visitor.enter
      ? visitor.enter(context, frame.parentState)
      : frame.parentState
    const children: Result[] = []

    activeNodes.add(frame.node)
    stack.push({
      children,
      context,
      node: frame.node,
      output: frame.output,
      phase: 'leave',
      state,
    })
    pushTreeFoldEntries(
      stack,
      getTreeChildren(frame.node, childrenKey),
      frame.node,
      frame.depth + 1,
      path,
      state,
      children,
    )
  }

  return results
}
