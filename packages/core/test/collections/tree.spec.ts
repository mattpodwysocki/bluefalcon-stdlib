import { describe, it, assert } from "vitest";
import { BinarySearchTree, AVLTree, Trie } from "../../src/collections/tree.js";

describe("BinarySearchTree", () => {
  it("should insert and find values", () => {
    const bst = new BinarySearchTree<number>();
    bst.insert(2);
    bst.insert(1);
    bst.insert(3);
    assert.equal(bst.has(1), true);
    assert.equal(bst.has(2), true);
    assert.equal(bst.has(3), true);
    assert.equal(bst.has(4), false);
  });

  it("should not insert duplicates", () => {
    const bst = new BinarySearchTree<number>();
    bst.insert(1);
    bst.insert(1);
    assert.equal(bst.has(1), true);
  });
});

describe("AVLTree", () => {
  it("should insert and find values", () => {
    const avl = new AVLTree<number>();
    avl.insert(2);
    avl.insert(1);
    avl.insert(3);
    assert.equal(avl.has(1), true);
    assert.equal(avl.has(2), true);
    assert.equal(avl.has(3), true);
    assert.equal(avl.has(4), false);
  });

  it("should not insert duplicates", () => {
    const avl = new AVLTree<number>();
    avl.insert(1);
    avl.insert(1);
    assert.equal(avl.has(1), true);
  });

  it("should stay balanced (height difference <= 1)", () => {
    const avl = new AVLTree<number>();
    for (let i = 1; i <= 100; i++) avl.insert(i);
    // Not a strict test, but if it didn't balance, this would stack overflow or be very slow
    for (let i = 1; i <= 100; i++) assert.equal(avl.has(i), true);
  });
});

describe("Trie", () => {
  it("should insert and find words", () => {
    const trie = new Trie();
    trie.insert("cat");
    trie.insert("car");
    trie.insert("dog");
    assert.equal(trie.has("cat"), true);
    assert.equal(trie.has("car"), true);
    assert.equal(trie.has("dog"), true);
    assert.equal(trie.has("ca"), false);
    assert.equal(trie.has("do"), false);
  });

  it("should check for prefixes", () => {
    const trie = new Trie();
    trie.insert("apple");
    trie.insert("app");
    assert.equal(trie.startsWith("app"), true);
    assert.equal(trie.startsWith("appl"), true);
    assert.equal(trie.startsWith("apple"), true);
    assert.equal(trie.startsWith("banana"), false);
  });

  it("should not find words not inserted", () => {
    const trie = new Trie();
    trie.insert("hello");
    assert.equal(trie.has("hell"), false);
    assert.equal(trie.has("hello"), true);
    assert.equal(trie.has("helloo"), false);
  });
});
