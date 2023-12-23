export function extend<T extends object, U extends object>(
  value: T,
  extension: U,
): asserts value is T & U {
  Object.assign(value, extension);
}
