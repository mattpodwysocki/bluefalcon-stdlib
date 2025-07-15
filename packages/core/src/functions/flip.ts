/**
 * Returns a new function with the first two arguments of the original function swapped.
 */
export function flip<F extends (...args: unknown[]) => unknown>(fn: F): F {
  return function (this: unknown, ...args: unknown[]): unknown {
    if (args.length < 2) {
      return fn.apply(this, args);
    }
    const [a, b, ...rest] = args;
    return fn.apply(this, [b, a, ...rest]);
  } as F;
}
