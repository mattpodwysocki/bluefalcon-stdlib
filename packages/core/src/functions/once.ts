/**
 * Returns a function that can only be called once. Subsequent calls return the first result.
 */
export function once<F extends (...args: unknown[]) => unknown>(fn: F): F {
  let called = false;
  let result: unknown;
  return function (this: unknown, ...args: unknown[]): unknown {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  } as F;
}
