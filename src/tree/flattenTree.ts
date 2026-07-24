import type { TreeTraversalContext } from './types'

// Preserve the public interface while sharing traversal fields.
// oxlint-disable-next-line typescript/no-empty-interface
export interface FlattenTreeContext<T> extends TreeTraversalContext<T> {}

export interface FlattenTreeOptions<
  T extends Record<PropertyKey, any>,
  K extends keyof T,
> {
  /**
   * children key, maybe `children`, `nodes`, `items` or other name
   *
   * @default `children`
   */
  childrenKey?: K

  /**
   * whether to include the current node in the result
   * @default true
   */
  includeSelf?: boolean

  /**
   * map function, return value will be used as the result of the current node, if not provided, the current node will be used as the result
   */
  map?: (ctx: FlattenTreeContext<T>) => unknown
}

/**
 * Flatten tree nodes into a one-dimensional array with depth-first pre-order traversal.
 *
 * If `options.map` is not provided, original nodes are returned.
 *
 * @param roots - Root nodes of the tree.
 * @param options - Flatten options.
 * @returns Flattened nodes.
 * @example
 *
 * ```typescript
 * import { flattenTree } from '@ntnyq/utils'
 *
 * const tree = [{ id: 1, children: [{ id: 2, children: [] }] }]
 * const result = flattenTree(tree)
 * console.log(result.map(item => item.id)) // => [1, 2]
 * ```
 *
 */
export function flattenTree<T extends Record<PropertyKey, any>, R>(
  roots: readonly T[],
  options: Omit<FlattenTreeOptions<T, keyof T>, 'map'> & {
    map: (ctx: FlattenTreeContext<T>) => R
  },
): R[]

/**
 * Flattens tree nodes without mapping them.
 * @param roots - Root nodes of the tree.
 * @param options - Flatten options without a map callback.
 * @returns Flattened nodes.
 */
export function flattenTree<T extends Record<PropertyKey, any>>(
  roots: readonly T[],
  options?: Omit<FlattenTreeOptions<T, keyof T>, 'map'>,
): T[]

/**
 * Internal implementation for the flattenTree overloads.
 * @param roots - Root nodes of the tree.
 * @param options - Flattening options.
 * @returns A flattened array of original nodes or mapped values.
 */
export function flattenTree<T extends Record<PropertyKey, any>>(
  roots: readonly T[],
  options: FlattenTreeOptions<T, keyof T> = {},
): any[] {
  const { childrenKey = 'children', includeSelf = true, map } = options

  const out: any[] = []

  function walk(
    nodes: readonly T[],
    parent: T | null,
    depth: number,
    path: T[],
  ) {
    nodes.forEach((node, index) => {
      const nextPath = [...path, node]

      if (includeSelf) {
        out.push(
          map ? map({ node, parent, depth, index, path: nextPath }) : node,
        )
      }

      const children = node[childrenKey] as unknown

      if (Array.isArray(children) && children.length > 0) {
        walk(children as T[], node, depth + 1, nextPath)
      }
    })
  }

  walk(roots, null, 0, [])
  return out
}
