/**
 * Returns a function that always returns the provided value.
 */
export function constant<T>(value: T): () => T {
  return () => value;
}
