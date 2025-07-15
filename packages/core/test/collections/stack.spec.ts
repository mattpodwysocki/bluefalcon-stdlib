import { describe, it, assert } from "vitest";
import { Stack } from "../../src/collections/stack.js";

describe("Stack", () => {
  it("should push and pop in LIFO order", () => {
    const s = new Stack<number>();
    s.push(1);
    s.push(2);
    s.push(3);
    assert.equal(s.pop(), 3);
    assert.equal(s.pop(), 2);
    assert.equal(s.pop(), 1);
    assert.equal(s.pop(), undefined);
  });

  it("should peek at the top element", () => {
    const s = new Stack<string>();
    s.push("a");
    s.push("b");
    assert.equal(s.peek(), "b");
    s.pop();
    assert.equal(s.peek(), "a");
    s.pop();
    assert.equal(s.peek(), undefined);
  });

  it("should return undefined when popping or peeking empty stack", () => {
    const s = new Stack<number>();
    assert.equal(s.pop(), undefined);
    assert.equal(s.peek(), undefined);
  });

  it("should clear the stack", () => {
    const s = new Stack<number>();
    s.push(1);
    s.push(2);
    s.clear();
    assert.equal(s.size, 0);
    assert.equal(s.pop(), undefined);
  });

  it("should report size and isEmpty correctly", () => {
    const s = new Stack<number>();
    assert.equal(s.size, 0);
    assert.equal(s.isEmpty(), true);
    s.push(1);
    assert.equal(s.size, 1);
    assert.equal(s.isEmpty(), false);
    s.pop();
    assert.equal(s.size, 0);
    assert.equal(s.isEmpty(), true);
  });

  it("should be iterable in LIFO order", () => {
    const s = new Stack<number>();
    s.push(1);
    s.push(2);
    s.push(3);
    assert.deepEqual(Array.from(s), [3, 2, 1]);
  });

  it("should convert to array in stack order", () => {
    const s = new Stack<number>();
    s.push(2);
    s.push(1);
    s.push(3);
    assert.deepEqual(s.toArray(), [2, 1, 3]);
  });
});
