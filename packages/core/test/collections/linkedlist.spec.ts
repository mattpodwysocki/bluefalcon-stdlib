import { describe, it, assert } from "vitest";
import { LinkedList } from "../../src/collections/linkedList.js";

describe("LinkedList", () => {
  it("should add elements to the list", () => {
    const list = new LinkedList<number>();
    const node1 = list.add(1);
    const node2 = list.add(2);
    const node3 = list.add(3);
    assert.equal(list.size, 3);
    assert.deepEqual(list.toArray(), [1, 2, 3]);
    assert.equal(node1.value, 1);
    assert.equal(node2.value, 2);
    assert.equal(node3.value, 3);
  });

  it("should remove nodes from the list", () => {
    const list = new LinkedList<number>();
    const node1 = list.add(1);
    const node2 = list.add(2);
    const node3 = list.add(3);
    list.remove(node2);
    assert.equal(list.size, 2);
    assert.deepEqual(list.toArray(), [1, 3]);
    list.remove(node1);
    assert.equal(list.size, 1);
    assert.deepEqual(list.toArray(), [3]);
    list.remove(node3);
    assert.equal(list.size, 0);
    assert.deepEqual(list.toArray(), []);
  });

  it("should iterate over the list", () => {
    const list = new LinkedList<string>();
    list.add("a");
    list.add("b");
    list.add("c");
    const result = [];
    for (const value of list) {
      result.push(value);
    }
    assert.deepEqual(result, ["a", "b", "c"]);
  });

  it("should clear the list", () => {
    const list = new LinkedList<number>();
    list.add(1);
    list.add(2);
    list.clear();
    assert.equal(list.size, 0);
    assert.deepEqual(list.toArray(), []);
  });

  it("should handle removing head and tail correctly", () => {
    const list = new LinkedList<number>();
    const node1 = list.add(1);
    list.add(2);
    const node3 = list.add(3);
    list.remove(node1); // remove head
    assert.deepEqual(list.toArray(), [2, 3]);
    list.remove(node3); // remove tail
    assert.deepEqual(list.toArray(), [2]);
  });
});
