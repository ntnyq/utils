/**
 * @file storage utils
 * @module Storage
 */

/**
 * Storage unit conversion constants
 */
export const STORAGE_UNITS = {
  BYTE: 1,
  KB: 1024,
  MB: (1024 * 1024) as 1048576,
  GB: (1024 * 1024 * 1024) as 1073741824,
  TB: (1024 * 1024 * 1024 * 1024) as 1099511627776,
} as const

export type StorageUnit = keyof typeof STORAGE_UNITS

/**
 * Converts storage units to bytes.
 * @param value - The size value.
 * @param fromUnit - The source unit (default: 'MB').
 * @returns The size in bytes.
 * @example
 * ```ts
 * convertToBytes(5, 'MB') // 5242880
 * convertToBytes(1, 'GB') // 1073741824
 * convertToBytes(512, 'KB') // 524288
 * ```
 */
export function convertToBytes(
  value: number,
  fromUnit: StorageUnit = 'MB',
): number {
  return value * STORAGE_UNITS[fromUnit]
}

/**
 * Converts bytes to specified storage unit.
 * @param bytes - The size in bytes.
 * @param toUnit - The target unit (default: 'MB').
 * @returns The size in the specified unit.
 * @example
 * ```ts
 * convertFromBytes(5242880, 'MB') // 5
 * convertFromBytes(1073741824, 'GB') // 1
 * convertFromBytes(524288, 'KB') // 512
 * ```
 */
export function convertFromBytes(
  bytes: number,
  toUnit: StorageUnit = 'MB',
): number {
  return bytes / STORAGE_UNITS[toUnit]
}

/**
 * Converts between storage units.
 * @param value - The size value.
 * @param fromUnit - The source unit.
 * @param toUnit - The target unit.
 * @returns The converted size.
 * @example
 * ```ts
 * convertStorageUnit(1, 'GB', 'MB') // 1024
 * convertStorageUnit(2048, 'MB', 'GB') // 2
 * convertStorageUnit(1024, 'KB', 'MB') // 1
 * ```
 */
export function convertStorageUnit(
  value: number,
  fromUnit: StorageUnit,
  toUnit: StorageUnit,
): number {
  const bytes = convertToBytes(value, fromUnit)
  return convertFromBytes(bytes, toUnit)
}
