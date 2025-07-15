/**
 * Creates a debounced version of a function that delays invoking the original function
 * until after wait milliseconds have elapsed since the last time it was invoked.
 */
export function debounce<F extends (...args: unknown[]) => unknown>(fn: F, wait: number): F {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: unknown, ...args: unknown[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };

  return debounced as F;
}
