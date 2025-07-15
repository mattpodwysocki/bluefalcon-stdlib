/**
 * Returns a function that negates the result of the given predicate function.
 */
export function not<F extends (...args: unknown[]) => boolean>(fn: F): (...args: Parameters<F>) => boolean {
  return (...args: Parameters<F>) => !fn(...args);
}
