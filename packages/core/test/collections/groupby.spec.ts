import { describe, it, assert } from "vitest";
import { groupBy } from "../../src/collections/groupby.js";

describe("groupBy", () => {
  it("should group numbers by even/odd", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = groupBy(arr, n => n % 2 === 0 ? "even" : "odd");
    assert.deepEqual(result.get("even"), [2, 4]);
    assert.deepEqual(result.get("odd"), [1, 3, 5]);
  });

  it("should group strings by first letter", () => {
    const arr = ["apple", "banana", "apricot", "blueberry"];
    const result = groupBy(arr, s => s[0]);
    assert.deepEqual(result.get("a"), ["apple", "apricot"]);
    assert.deepEqual(result.get("b"), ["banana", "blueberry"]);
  });

  it("should return an empty map for empty input", () => {
    const result = groupBy([], x => x);
    assert.equal(result.size, 0);
  });

  it("should group objects by property", () => {
    const arr = [{ type: "cat" }, { type: "dog" }, { type: "cat" }];
    const result = groupBy(arr, o => o.type);
    assert.deepEqual(result.get("cat"), [{ type: "cat" }, { type: "cat" }]);
    assert.deepEqual(result.get("dog"), [{ type: "dog" }]);
  });

  it("should work with Set as input", () => {
    const set = new Set([1, 2, 3, 4]);
    const result = groupBy(set, n => n % 2);
    assert.deepEqual(result.get(0), [2, 4]);
    assert.deepEqual(result.get(1), [1, 3]);
  });
});
