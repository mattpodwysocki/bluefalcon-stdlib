/**
 * Returns a new object with the specified keys omitted.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as Partial<T>;
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}
