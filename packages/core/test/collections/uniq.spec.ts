import { describe, it, assert } from "vitest";
import { uniq } from "../../src/collections/uniq.js";

describe("uniq", () => {
  it("should remove duplicates from an array of numbers", () => {
    const arr = [1, 2, 2, 3, 1, 4];
    assert.deepEqual(Array.from(uniq(arr)), [1, 2, 3, 4]);
  });

  it("should remove duplicates from an array of strings", () => {
    const arr = ["a", "b", "a", "c", "b"];
    assert.deepEqual(Array.from(uniq(arr)), ["a", "b", "c"]);
  });

  it("should work with empty input", () => {
    assert.deepEqual(Array.from(uniq([])), []);
  });

  it("should work with any iterable", () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 1;
      yield 3;
    }
    assert.deepEqual(Array.from(uniq(gen())), [1, 2, 3]);
  });

  it("should preserve order of first occurrence", () => {
    const arr = [3, 2, 1, 2, 3, 1, 4];
    assert.deepEqual(Array.from(uniq(arr)), [3, 2, 1, 4]);
  });

  it("should handle objects by reference", () => {
    const a = { x: 1 };
    const b = { x: 1 };
    const arr = [a, b, a];
    assert.deepEqual(Array.from(uniq(arr)), [a, b]);
  });

  it("should handle NaN as a unique value", () => {
    const arr = [NaN, NaN, 1, NaN];
    assert.deepEqual(Array.from(uniq(arr)), [NaN, 1]);
  });
});
