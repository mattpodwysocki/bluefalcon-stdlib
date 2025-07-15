import { describe, it, assert } from "vitest";
import { memoize } from "../../src/functions/memoize.js";

describe("memoize", () => {
  it("should cache results for the same arguments", () => {
    let callCount = 0;
    const add = memoize((a: number, b: number) => {
      callCount++;
      return a + b;
    });

    assert.equal(add(1, 2), 3);
    assert.equal(add(1, 2), 3);
    assert.equal(callCount, 1, "Function should only be called once for same args");
  });

  it("should not cache results for different arguments", () => {
    let callCount = 0;
    const multiply = memoize((a: number, b: number) => {
      callCount++;
      return a * b;
    });

    assert.equal(multiply(2, 3), 6);
    assert.equal(multiply(3, 2), 6);
    assert.equal(callCount, 2, "Function should be called for different args");
  });

  it("should work with string arguments", () => {
    let callCount = 0;
    const greet = memoize((name: string) => {
      callCount++;
      return `Hello, ${name}!`;
    });

    assert.equal(greet("Alice"), "Hello, Alice!");
    assert.equal(greet("Alice"), "Hello, Alice!");
    assert.equal(callCount, 1);
    assert.equal(greet("Bob"), "Hello, Bob!");
    assert.equal(callCount, 2);
  });

  it("should work with no arguments", () => {
    let callCount = 0;
    const getTime = memoize(() => {
      callCount++;
      return 42;
    });

    assert.equal(getTime(), 42);
    assert.equal(getTime(), 42);
    assert.equal(callCount, 1);
  });

  it("should treat different argument types as different keys", () => {
    let callCount = 0;
    const fn = memoize((x: unknown) => {
      callCount++;
      return typeof x;
    });

    assert.equal(fn(1), "number");
    assert.equal(fn("1"), "string");
    assert.equal(fn(1), "number");
    assert.equal(callCount, 2);
  });
});
