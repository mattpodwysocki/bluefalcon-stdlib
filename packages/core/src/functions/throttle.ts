/**
 * Creates a throttled version of a function that only invokes the original function
 * at most once per every wait milliseconds.
 */
export function throttle<F extends (...args: unknown[]) => unknown>(fn: F, wait: number): F {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] | null = null;

  const throttled = function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      lastArgs = args;
      if (!timeout) {
        timeout = setTimeout(() => {
          lastCall = Date.now();
          timeout = null;
          if (lastArgs) {
            fn.apply(this, lastArgs);
            lastArgs = null;
          }
        }, wait - (now - lastCall));
      }
    }
  };

  return throttled as F;
}
