/**
 * Yields only the first occurrence of each unique value from the input iterable.
 * Preserves order. Uses SameValueZero equality (like Set).
 */
export function* uniq<T>(iterable: Iterable<T>): Iterable<T> {
  const seen = new Set<T>();
  for (const item of iterable) {
    if (!seen.has(item)) {
      seen.add(item);
      yield item;
    }
  }
}
