import { describe, it, assert } from "vitest";
import { RingBuffer } from "../../src/collections/ringbuffer.js";

describe("RingBuffer", () => {
  it("should push and shift items in FIFO order", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    assert.equal(rb.shift(), 1);
    assert.equal(rb.shift(), 2);
    assert.equal(rb.shift(), 3);
    assert.equal(rb.shift(), undefined);
  });

  it("should pop items in LIFO order", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    assert.equal(rb.pop(), 3);
    assert.equal(rb.pop(), 2);
    assert.equal(rb.pop(), 1);
    assert.equal(rb.pop(), undefined);
  });

  it("should overwrite oldest when full", () => {
    const rb = new RingBuffer<number>(2);
    rb.push(1);
    rb.push(2);
    rb.push(3); // overwrites 1
    assert.deepEqual(rb.toArray(), [2, 3]);
    assert.equal(rb.size, 2);
    assert.equal(rb.shift(), 2);
    assert.equal(rb.shift(), 3);
    assert.equal(rb.shift(), undefined);
  });

  it("should report isEmpty and isFull correctly", () => {
    const rb = new RingBuffer<number>(2);
    assert.equal(rb.isEmpty(), true);
    assert.equal(rb.isFull(), false);
    rb.push(1);
    assert.equal(rb.isEmpty(), false);
    assert.equal(rb.isFull(), false);
    rb.push(2);
    assert.equal(rb.isFull(), true);
    rb.shift();
    assert.equal(rb.isFull(), false);
  });

  it("should clear the buffer", () => {
    const rb = new RingBuffer<number>(2);
    rb.push(1);
    rb.push(2);
    rb.clear();
    assert.equal(rb.size, 0);
    assert.equal(rb.isEmpty(), true);
    assert.deepEqual(rb.toArray(), []);
  });

  it("should peek at the oldest item", () => {
    const rb = new RingBuffer<number>(2);
    rb.push(1);
    rb.push(2);
    assert.equal(rb.peek(), 1);
    rb.shift();
    assert.equal(rb.peek(), 2);
    rb.shift();
    assert.equal(rb.peek(), undefined);
  });

  it("should be iterable in FIFO order", () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    assert.deepEqual(Array.from(rb), [1, 2, 3]);
  });

  it("should throw if capacity is not positive", () => {
    assert.throws(() => new RingBuffer(0));
    assert.throws(() => new RingBuffer(-1));
  });
});
