import { describe, it, assert } from "vitest";
import { MultiSet } from "../../src/collections/multiset.js";

describe("MultiSet", () => {
  it("should add items and count them", () => {
    const ms = new MultiSet<string>();
    ms.add("a");
    ms.add("b", 2);
    ms.add("a", 3);
    assert.equal(ms.count("a"), 4);
    assert.equal(ms.count("b"), 2);
    assert.equal(ms.count("c"), 0);
    assert.equal(ms.size, 6);
    assert.equal(ms.uniqueSize, 2);
  });

  it("should delete items and decrease count", () => {
    const ms = new MultiSet<number>();
    ms.add(1, 5);
    assert.equal(ms.delete(1, 2), true);
    assert.equal(ms.count(1), 3);
    assert.equal(ms.delete(1, 3), true);
    assert.equal(ms.count(1), 0);
    assert.equal(ms.delete(1), false);
  });

  it("should check for item existence", () => {
    const ms = new MultiSet<string>();
    ms.add("x", 2);
    assert.equal(ms.has("x"), true);
    ms.delete("x", 2);
    assert.equal(ms.has("x"), false);
  });

  it("should clear all items", () => {
    const ms = new MultiSet<number>();
    ms.add(1, 2);
    ms.add(2, 3);
    ms.clear();
    assert.equal(ms.size, 0);
    assert.equal(ms.uniqueSize, 0);
  });

  it("should iterate over all items", () => {
    const ms = new MultiSet<string>();
    ms.add("a", 2);
    ms.add("b", 1);
    const arr = Array.from(ms);
    assert.deepEqual(arr.sort(), ["a", "a", "b"]);
  });

  it("should return correct entries", () => {
    const ms = new MultiSet<string>();
    ms.add("foo", 2);
    ms.add("bar", 1);
    const entries = Array.from(ms.entries());
    assert.deepEqual(entries, [["foo", 2], ["bar", 1]]);
  });

  it("should convert to array", () => {
    const ms = new MultiSet<number>();
    ms.add(1, 2);
    ms.add(2, 1);
    assert.deepEqual(ms.toArray().sort(), [1, 1, 2]);
  });

  it("should ignore add/delete with non-positive count", () => {
    const ms = new MultiSet<string>();
    ms.add("a", 0);
    ms.add("b", -1);
    assert.equal(ms.size, 0);
    ms.add("a", 2);
    ms.delete("a", 0);
    ms.delete("a", -1);
    assert.equal(ms.count("a"), 2);
  });
});
