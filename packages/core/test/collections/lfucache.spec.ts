
import { describe, it, assert } from "vitest";
import { LFUCache } from "../../src/collections/lfuCache.js";

describe("LFUCache", () => {
  it("should set and get values", () => {
    const cache = new LFUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    assert.equal(cache.get("a"), 1);
    assert.equal(cache.get("b"), 2);
    assert.equal(cache.get("c"), 3);
  });

  it("should evict the least frequently used item", () => {
    const cache = new LFUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    // Access "a" to increase its frequency
    cache.get("a");
    // Add "c", should evict "b"
    cache.set("c", 3);
    assert.equal(cache.has("a"), true);
    assert.equal(cache.has("b"), false);
    assert.equal(cache.has("c"), true);
  });

  it("should evict the least recently used among least frequently used", () => {
    const cache = new LFUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    // Both "a" and "b" have freq 1, "a" is LRU
    cache.set("c", 3);
    assert.equal(cache.has("a"), false);
    assert.equal(cache.has("b"), true);
    assert.equal(cache.has("c"), true);
  });

  it("should update frequency on get and set", () => {
    const cache = new LFUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a"); // freq of "a" is now 2
    cache.set("a", 10); // freq of "a" is now 3
    cache.set("c", 3); // should evict "b"
    assert.equal(cache.has("a"), true);
    assert.equal(cache.has("b"), false);
    assert.equal(cache.has("c"), true);
    assert.equal(cache.get("a"), 10);
  });

  it("should delete and clear items", () => {
    const cache = new LFUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    assert.equal(cache.delete("a"), true);
    assert.equal(cache.has("a"), false);
    cache.clear();
    assert.equal(cache.size, 0);
  });

  it("should return correct size, keys, values, and entries", () => {
    const cache = new LFUCache<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    assert.equal(cache.size, 3);
    assert.deepEqual(Array.from(cache.keys()).sort(), ["a", "b", "c"]);
    assert.deepEqual(Array.from(cache.values()).sort((a, b) => a - b), [1, 2, 3]);
    assert.deepEqual(
      Array.from(cache.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      [["a", 1], ["b", 2], ["c", 3]]
    );
  });
});
