import { describe, it, assert } from "vitest";
import { flip } from "../../src/functions/flip.js";

describe("flip", () => {
  it("should swap the first two arguments of a binary function", () => {
    const subtract = (a: number, b: number) => a - b;
    const flipped = flip(subtract);
    assert.equal(flipped(3, 10), 7); // subtract(10, 3)
  });

  it("should swap only the first two arguments of a function with more than two args", () => {
    const fn = (a: string, b: string, c: string) => `${a},${b},${c}`;
    const flipped = flip(fn);
    assert.equal(flipped("A", "B", "C"), "B,A,C");
  });

  it("should work with functions of one argument (no change)", () => {
    const fn = (x: number) => x * 2;
    const flipped = flip(fn);
    assert.equal(flipped(5), 10);
  });

  it("should work with functions of zero arguments (no change)", () => {
    const fn = () => 42;
    const flipped = flip(fn);
    assert.equal(flipped(), 42);
  });

  it("should preserve this context", () => {
    const obj = {
      x: 2,
      fn(a: number, b: number) {
        return this.x + a + b;
      }
    };
    const flipped = flip(obj.fn);
    assert.equal(flipped.call(obj, 3, 4), 9); // should be obj.x + 4 + 3
  });
});
