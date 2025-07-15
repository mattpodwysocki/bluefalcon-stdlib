import { describe, it, assert } from "vitest";
import { Heap } from "../../src/collections/heap.js";

describe("Heap", () => {
  it("should push and pop in min-heap order by default", () => {
    const heap = new Heap<number>();
    heap.push(5);
    heap.push(3);
    heap.push(8);
    heap.push(1);

    assert.equal(heap.pop(), 1);
    assert.equal(heap.pop(), 3);
    assert.equal(heap.pop(), 5);
    assert.equal(heap.pop(), 8);
    assert.equal(heap.pop(), undefined);
  });

  it("should peek the minimum element", () => {
    const heap = new Heap<number>();
    heap.push(10);
    heap.push(2);
    heap.push(7);
    assert.equal(heap.peek(), 2);
    heap.pop();
    assert.equal(heap.peek(), 7);
  });

  it("should report size and isEmpty correctly", () => {
    const heap = new Heap<number>();
    assert.equal(heap.size, 0);
    assert.equal(heap.isEmpty(), true);
    heap.push(1);
    assert.equal(heap.size, 1);
    assert.equal(heap.isEmpty(), false);
    heap.pop();
    assert.equal(heap.size, 0);
    assert.equal(heap.isEmpty(), true);
  });

  it("should clear the heap", () => {
    const heap = new Heap<number>();
    heap.push(1);
    heap.push(2);
    heap.clear();
    assert.equal(heap.size, 0);
    assert.equal(heap.pop(), undefined);
  });

  it("should be iterable and toArray should return sorted", () => {
    const heap = new Heap<number>();
    heap.push(3);
    heap.push(1);
    heap.push(2);
    assert.deepEqual(Array.from(heap), [1, 2, 3]);
    assert.deepEqual(heap.toArray(), [1, 2, 3]);
  });

  it("should support custom comparator (max-heap)", () => {
    const heap = new Heap<number>((a, b) => b - a);
    heap.push(1);
    heap.push(5);
    heap.push(3);
    assert.equal(heap.pop(), 5);
    assert.equal(heap.pop(), 3);
    assert.equal(heap.pop(), 1);
  });
});
