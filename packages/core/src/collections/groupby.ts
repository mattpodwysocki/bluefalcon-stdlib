/**
 * Groups elements of an iterable by a key function.
 * Returns a Map where each key is the result of keyFn and each value is an array of elements.
 */
export function groupBy<T, K>(iterable: Iterable<T>, keyFn: (item: T) => K): Map<K, T[]> {
  const result = new Map<K, T[]>();
  for (const item of iterable) {
    const key = keyFn(item);
    if (!result.has(key)) {
      result.set(key, []);
    }
    result.get(key)!.push(item);
  }
  return result;
}
