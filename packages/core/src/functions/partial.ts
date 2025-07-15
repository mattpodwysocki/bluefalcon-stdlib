/**
 * Partially applies arguments to a function, returning a new function.
 */
export function partial<F extends (...args: unknown[]) => unknown>(
  fn: F,
  ...presetArgs: unknown[]
): (...laterArgs: unknown[]) => unknown {
  return (...laterArgs: unknown[]) => fn(...presetArgs, ...laterArgs);
}
