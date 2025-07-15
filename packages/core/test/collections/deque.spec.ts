import { describe, it, assert } from "vitest";
import { DoubleEndedQueue } from "../../src/collections/deque.js";

describe("DoubleEndedQueue", () => {
  it("should push and pop from the back", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushBack(1);
    deque.pushBack(2);
    assert.strictEqual(deque.popBack(), 2);
    assert.strictEqual(deque.popBack(), 1);
    assert.strictEqual(deque.popBack(), undefined);
  });

  it("should push and pop from the front", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushFront(1);
    deque.pushFront(2);
    assert.strictEqual(deque.popFront(), 2);
    assert.strictEqual(deque.popFront(), 1);
    assert.strictEqual(deque.popFront(), undefined);
  });

  it("should allow mixed operations", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushBack(1);
    deque.pushFront(2);
    deque.pushBack(3);
    assert.strictEqual(deque.popFront(), 2);
    assert.strictEqual(deque.popBack(), 3);
    assert.strictEqual(deque.popFront(), 1);
    assert.strictEqual(deque.isEmpty(), true);
  });

  it("should peek correctly", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushBack(1);
    deque.pushBack(2);
    assert.strictEqual(deque.peekFront(), 1);
    assert.strictEqual(deque.peekBack(), 2);
    deque.popFront();
    assert.strictEqual(deque.peekFront(), 2);
    assert.strictEqual(deque.peekBack(), 2);
  });

  it("should clear the deque", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushBack(1);
    deque.pushBack(2);
    deque.clear();
    assert.strictEqual(deque.size, 0);
    assert.strictEqual(deque.isEmpty(), true);
    assert.strictEqual(deque.popFront(), undefined);
  });

  it("should be iterable", () => {
    const deque = new DoubleEndedQueue<number>();
    deque.pushBack(1);
    deque.pushBack(2);
    deque.pushBack(3);
    const arr = Array.from(deque);
    assert.deepStrictEqual(arr, [1, 2, 3]);
  });
});
