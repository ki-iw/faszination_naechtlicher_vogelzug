export function hasNonNullProp<T, K extends keyof T>(
  obj: T,
  key: K,
): obj is T & { [P in K]-?: NonNullable<T[P]> } {
  return obj?.[key] !== null && obj[key] !== undefined;
}
