/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Curry a function of any arity.
 */
export function curry<F extends (...args: any[]) => any>(fn: F): any {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return (...next: any[]) => curried.apply(this, [...args, ...next]);
    }
  };
}

/**
 * Uncurry a curried function back to a function of multiple arguments.
 */
export function uncurry<F extends (...args: any[]) => any>(fn: any): F {
  return function (this: any, ...args: any[]): any {
    let result = fn;
    for (const arg of args) {
      result = result.call(this, arg);
    }
    return result;
  } as F;
}
