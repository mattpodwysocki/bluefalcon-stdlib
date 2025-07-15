import { describe, it, assert } from "vitest";
import { PriorityQueue } from "../../src/collections/priorityqueue.js";

describe("PriorityQueue", () => {
  it("should enqueue and dequeue in priority order (min-heap)", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(5);
    pq.enqueue(1);
    pq.enqueue(3);
    pq.enqueue(2);
    pq.enqueue(4);
    const result = [];
    while (!pq.isEmpty()) {
      result.push(pq.dequeue());
    }
    assert.deepEqual(result, [1, 2, 3, 4, 5]);
  });

  it("should peek at the top element", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(10);
    pq.enqueue(5);
    assert.equal(pq.peek(), 5);
    pq.dequeue();
    assert.equal(pq.peek(), 10);
  });

  it("should return undefined when dequeueing or peeking empty queue", () => {
    const pq = new PriorityQueue<number>();
    assert.equal(pq.dequeue(), undefined);
    assert.equal(pq.peek(), undefined);
  });

  it("should clear the queue", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(1);
    pq.enqueue(2);
    pq.clear();
    assert.equal(pq.size, 0);
    assert.equal(pq.dequeue(), undefined);
  });

  it("should support custom comparator (max-heap)", () => {
    const pq = new PriorityQueue<number>((a, b) => b - a);
    pq.enqueue(1);
    pq.enqueue(3);
    pq.enqueue(2);
    const result = [];
    while (!pq.isEmpty()) {
      result.push(pq.dequeue());
    }
    assert.deepEqual(result, [3, 2, 1]);
  });

  it("should be iterable in priority order", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(2);
    pq.enqueue(1);
    pq.enqueue(3);
    assert.deepEqual(Array.from(pq), [1, 2, 3]);
  });

  it("should convert to array in priority order", () => {
    const pq = new PriorityQueue<number>();
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(2);
    assert.deepEqual(pq.toArray(), [1, 2, 3]);
  });
});
