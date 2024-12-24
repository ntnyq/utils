export type JsonArray = JsonValue[] | readonly JsonValue[]
export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined
}
export type JsonPrimitive = boolean | number | string | null

/**
 * @copyright {@link https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts}
 */
export type JsonValue = JsonArray | JsonObject | JsonPrimitive
