/**
 * Memoizes a function, caching its results based on its arguments.
 * Only works reliably for functions with primitive arguments or arguments that can be stringified.
 */
export function memoize<F extends (...args: unknown[]) => unknown>(fn: F): F {
  const cache = new Map<string, ReturnType<F>>();
  return function (...args: Parameters<F>): ReturnType<F> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args) as ReturnType<F>;
    cache.set(key, result);
    return result;
  } as F;
}
