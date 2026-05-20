/**
 * 注释正则
 *
 * 匹配 \<!-- 或 /* 开头的注释，直到 --> 或 *\/ 结尾
 */
export const RE_COMMENTS: RegExp = /(?:<!--|\/\*)([\s\S]*?)(?:-->|\*\/)/gu

/**
 * JavaScript line comment
 */
export const RE_LINE_COMMENT: RegExp = /\/\/.*/u

/**
 * JavaScript block comment
 */
export const RE_BLOCK_COMMENT: RegExp = /\/\*[\s\S]*?\*\//gu
