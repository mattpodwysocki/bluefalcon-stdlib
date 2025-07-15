import { describe, it, assert } from "vitest";
import { LRUCache } from "../../src/collections/lruCache.js";

describe("LRUCache", () => {
  it("should set and get values", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    assert.equal(cache.get("a"), 1);
    assert.equal(cache.get("b"), 2);
  });

  it("should evict least recently used item when maxSize is exceeded", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3); // "a" should be evicted
    assert.equal(cache.get("a"), undefined);
    assert.equal(cache.get("b"), 2);
    assert.equal(cache.get("c"), 3);
  });

  it("should update recently used order on get", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.get("a"); // "a" becomes most recently used
    cache.set("c", 3); // "b" should be evicted
    assert.equal(cache.get("a"), 1);
    assert.equal(cache.get("b"), undefined);
    assert.equal(cache.get("c"), 3);
  });

  it("should update value if key already exists", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("a", 2);
    assert.equal(cache.get("a"), 2);
    assert.equal(cache.size, 1);
  });

  it("should delete keys", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    assert.equal(cache.delete("a"), true);
    assert.equal(cache.get("a"), undefined);
    assert.equal(cache.delete("a"), false);
  });

  it("should clear all entries", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    assert.equal(cache.size, 0);
    assert.equal(cache.get("a"), undefined);
    assert.equal(cache.get("b"), undefined);
  });

  it("should return correct keys, values, and entries", () => {
    const cache = new LRUCache<string, number>(2);
    cache.set("a", 1);
    cache.set("b", 2);
    assert.deepEqual(Array.from(cache.keys()), ["a", "b"]);
    assert.deepEqual(Array.from(cache.values()), [1, 2]);
    assert.deepEqual(Array.from(cache.entries()), [["a", 1], ["b", 2]]);
  });

  it("should throw if maxSize is not positive", () => {
    assert.throws(() => new LRUCache(0));
    assert.throws(() => new LRUCache(-1));
  });
});
