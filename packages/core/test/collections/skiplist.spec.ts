import { describe, it, assert } from "vitest";
import { SkipList } from "../../src/collections/skiplist.js";

describe("SkipList", () => {
  it("should insert and find values", () => {
    const sl = new SkipList<number>();
    sl.insert(1);
    sl.insert(3);
    sl.insert(2);
    assert.equal(sl.has(1), true);
    assert.equal(sl.has(2), true);
    assert.equal(sl.has(3), true);
    assert.equal(sl.has(4), false);
  });

  it("should not insert duplicates", () => {
    const sl = new SkipList<number>();
    sl.insert(1);
    sl.insert(1);
    assert.equal(sl.size, 1);
    sl.insert(2);
    assert.equal(sl.size, 2);
  });

  it("should delete values", () => {
    const sl = new SkipList<number>();
    sl.insert(1);
    sl.insert(2);
    sl.insert(3);
    assert.equal(sl.delete(2), true);
    assert.equal(sl.has(2), false);
    assert.equal(sl.size, 2);
    assert.equal(sl.delete(2), false);
  });

  it("should clear the skiplist", () => {
    const sl = new SkipList<number>();
    sl.insert(1);
    sl.insert(2);
    sl.clear();
    assert.equal(sl.size, 0);
    assert.equal(sl.has(1), false);
    assert.equal(sl.has(2), false);
  });

  it("should be iterable in sorted order", () => {
    const sl = new SkipList<number>();
    sl.insert(3);
    sl.insert(1);
    sl.insert(2);
    assert.deepEqual(Array.from(sl), [1, 2, 3]);
  });

  it("should convert to array in sorted order", () => {
    const sl = new SkipList<number>();
    sl.insert(2);
    sl.insert(1);
    sl.insert(3);
    assert.deepEqual(sl.toArray(), [1, 2, 3]);
  });

  it("should support custom comparator", () => {
    const sl = new SkipList<number>((a, b) => b - a); // descending
    sl.insert(1);
    sl.insert(2);
    sl.insert(3);
    assert.deepEqual(sl.toArray(), [3, 2, 1]);
  });
});
