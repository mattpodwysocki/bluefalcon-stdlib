/**
 * Yields each item from the input iterable, calling fn(item) for side effects.
 * Useful for debugging or logging in a chain of iterable operations.
 */
export function* tap<T>(iterable: Iterable<T>, fn: (item: T) => void): Iterable<T> {
  for (const item of iterable) {
    fn(item);
    yield item;
  }
}
