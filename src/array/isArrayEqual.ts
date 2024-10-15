export function isArrayEqual(array1: unknown[], array2: unknown[]) {
  if (array1.length !== array2.length) {
    return false
  }

  return array1.every((item, idx) => item === array2[idx])
}
