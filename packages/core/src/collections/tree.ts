import { Comparator } from "./collection.js";

// --- Binary Search Tree ---
export class BSTNode<T> {
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

export class BinarySearchTree<T> {
  _root: BSTNode<T> | null = null;
  _compare: Comparator<T>;

  constructor(compareFn?: Comparator<T>) {
    this._compare = compareFn ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  insert(value: T): void {
    this._root = this._insert(this._root, value);
  }

  private _insert(node: BSTNode<T> | null, value: T): BSTNode<T> {
    if (!node) return new BSTNode(value);
    const cmp = this._compare(value, node.value);
    if (cmp < 0) node.left = this._insert(node.left, value);
    else if (cmp > 0) node.right = this._insert(node.right, value);
    return node;
  }

  has(value: T): boolean {
    let node = this._root;
    while (node) {
      const cmp = this._compare(value, node.value);
      if (cmp === 0) return true;
      node = cmp < 0 ? node.left : node.right;
    }
    return false;
  }
}

// --- AVL Tree (Self-balancing BST) ---
class AVLNode<T> extends BSTNode<T> {
  height = 1;
  left: AVLNode<T> | null = null;
  right: AVLNode<T> | null = null;
}

export class AVLTree<T> {
  _root: AVLNode<T> | null = null;
  _compare: Comparator<T>;

  constructor(compareFn?: Comparator<T>) {
    this._compare = compareFn ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  insert(value: T): void {
    this._root = this._insert(this._root, value);
  }

  private _insert(node: AVLNode<T> | null, value: T): AVLNode<T> {
    if (!node) return new AVLNode(value);
    const cmp = this._compare(value, node.value);
    if (cmp < 0) node.left = this._insert(node.left, value);
    else if (cmp > 0) node.right = this._insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    return this._balance(node);
  }

  private _height(node: AVLNode<T> | null): number {
    return node ? node.height : 0;
  }

  private _balanceFactor(node: AVLNode<T>): number {
    return this._height(node.left) - this._height(node.right);
  }

  private _balance(node: AVLNode<T>): AVLNode<T> {
    const bf = this._balanceFactor(node);
    if (bf > 1) {
      if (this._balanceFactor(node.left!) < 0) node.left = this._rotateLeft(node.left!);
      return this._rotateRight(node);
    }
    if (bf < -1) {
      if (this._balanceFactor(node.right!) > 0) node.right = this._rotateRight(node.right!);
      return this._rotateLeft(node);
    }
    return node;
  }

  private _rotateLeft(a: AVLNode<T>): AVLNode<T> {
    const b = a.right!;
    a.right = b.left;
    b.left = a;
    a.height = 1 + Math.max(this._height(a.left), this._height(a.right));
    b.height = 1 + Math.max(this._height(b.left), this._height(b.right));
    return b;
  }

  private _rotateRight(a: AVLNode<T>): AVLNode<T> {
    const b = a.left!;
    a.left = b.right;
    b.right = a;
    a.height = 1 + Math.max(this._height(a.left), this._height(a.right));
    b.height = 1 + Math.max(this._height(b.left), this._height(b.right));
    return b;
  }

  has(value: T): boolean {
    let node = this._root;
    while (node) {
      const cmp = this._compare(value, node.value);
      if (cmp === 0) return true;
      node = cmp < 0 ? node.left : node.right;
    }
    return false;
  }
}

// --- Trie (Prefix Tree) ---
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

export class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) node.children.set(char, new TrieNode());
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }

  has(word: string): boolean {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char)!;
    }
    return true;
  }
}
