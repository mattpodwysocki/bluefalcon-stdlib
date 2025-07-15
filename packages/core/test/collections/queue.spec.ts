import { describe, it, assert } from "vitest";
import { Queue } from "../../src/collections/queue.js";

describe("Queue", () => {
  it("should enqueue and dequeue in FIFO order", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    assert.equal(q.dequeue(), 1);
    assert.equal(q.dequeue(), 2);
    assert.equal(q.dequeue(), 3);
    assert.equal(q.dequeue(), undefined);
  });

  it("should peek at the front element", () => {
    const q = new Queue<string>();
    q.enqueue("a");
    q.enqueue("b");
    assert.equal(q.peek(), "a");
    q.dequeue();
    assert.equal(q.peek(), "b");
  });

  it("should return undefined when dequeueing or peeking empty queue", () => {
    const q = new Queue<number>();
    assert.equal(q.dequeue(), undefined);
    assert.equal(q.peek(), undefined);
  });

  it("should clear the queue", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.clear();
    assert.equal(q.size, 0);
    assert.equal(q.dequeue(), undefined);
  });

  it("should report size and isEmpty correctly", () => {
    const q = new Queue<number>();
    assert.equal(q.size, 0);
    assert.equal(q.isEmpty(), true);
    q.enqueue(1);
    assert.equal(q.size, 1);
    assert.equal(q.isEmpty(), false);
    q.dequeue();
    assert.equal(q.size, 0);
    assert.equal(q.isEmpty(), true);
  });

  it("should be iterable in FIFO order", () => {
    const q = new Queue<number>();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    assert.deepEqual(Array.from(q), [1, 2, 3]);
  });

  it("should convert to array in FIFO order", () => {
    const q = new Queue<number>();
    q.enqueue(2);
    q.enqueue(1);
    q.enqueue(3);
    assert.deepEqual(q.toArray(), [2, 1, 3]);
  });
});
