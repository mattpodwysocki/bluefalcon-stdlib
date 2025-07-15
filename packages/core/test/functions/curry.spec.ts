import { describe, it, assert } from "vitest";
import { curry, uncurry } from "../../src/functions/curry.js";

describe("curry", () => {
  it("should curry a function of two arguments", () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);
    assert.equal(curriedAdd(2)(3), 5);
  });

  it("should curry a function of three arguments", () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curriedSum = curry(sum);
    assert.equal(curriedSum(1)(2)(3), 6);
  });

  it("should allow partial application", () => {
    const join = (a: string, b: string, c: string) => a + b + c;
    const curriedJoin = curry(join);
    const joinAB = curriedJoin("A")("B");
    assert.equal(joinAB("C"), "ABC");
  });

  it("should call the function if enough arguments are provided", () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);
    assert.equal(curriedAdd(2, 3), 5);
  });
});

describe("uncurry", () => {
  it("should uncurry a curried function of two arguments", () => {
    const curriedAdd = (a: number) => (b: number) => a + b;
    const uncurriedAdd = uncurry(curriedAdd);
    assert.equal(uncurriedAdd(2, 3), 5);
  });

  it("should uncurry a curried function of three arguments", () => {
    const curriedSum = (a: number) => (b: number) => (c: number) => a + b + c;
    const uncurriedSum = uncurry(curriedSum);
    assert.equal(uncurriedSum(1, 2, 3), 6);
  });

  it("should work with mixed application", () => {
    const curried = (a: string) => (b: string) => (c: string) => a + b + c;
    const uncurried = uncurry(curried);
    assert.equal(uncurried("A", "B", "C"), "ABC");
  });
});
