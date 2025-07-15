/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pipes the value through a sequence of functions from left to right.
 * Usage: pipe(value, f1, f2, f3) === f3(f2(f1(value)))
 */
export function pipe<T>(value: T, ...fns: Array<(arg: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/**
 * Composes functions from right to left.
 * Usage: compose(f3, f2, f1)(value) === f3(f2(f1(value)))
 */
export function compose<T>(...fns: Array<(arg: any) => any>): (value: T) => any {
  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}
