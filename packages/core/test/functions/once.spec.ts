import { describe, it, assert } from "vitest";
import { once } from "../../src/functions/once.js";

describe("once", () => {
  it("should call the function only once", () => {
    let callCount = 0;
    const fn = once(() => { callCount++; return 42; });

    assert.equal(fn(), 42);
    assert.equal(fn(), 42);
    assert.equal(fn(), 42);
    assert.equal(callCount, 1);
  });

  it("should always return the first result", () => {
    let value = 0;
    const fn = once(() => ++value);

    assert.equal(fn(), 1);
    assert.equal(fn(), 1);
    value = 100;
    assert.equal(fn(), 1);
  });

  it("should preserve this context", () => {
    const obj = {
      x: 5,
      getX: once(function (this: { x: number }) { return this.x; })
    };
    assert.equal(obj.getX(), 5);
    obj.x = 10;
    assert.equal(obj.getX(), 5);
  });

  it("should pass arguments only on the first call", () => {
    const fn = once((a: number, b: number) => a + b);
    assert.equal(fn(2, 3), 5);
    assert.equal(fn(10, 20), 5);
  });
});
