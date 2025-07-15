import { Comparator, defaultComparer } from "./collection.js";

class SkipListNode<T> {
  value: T | null;
  forwards: Array<SkipListNode<T> | null>;

  constructor(value: T | null, level: number) {
    this.value = value;
    this.forwards = new Array(level + 1).fill(null);
  }
}

export class SkipList<T> implements Iterable<T> {
  private static readonly MAX_LEVEL = 16;
  private static readonly P = 0.5;

  private _head: SkipListNode<T>;
  private _level = 0;
  private _size = 0;
  private _compare: Comparator<T>;

  constructor(compareFn?: Comparator<T>) {
    this._head = new SkipListNode<T>(null, SkipList.MAX_LEVEL);
    this._compare = compareFn ?? defaultComparer;
  }

  private randomLevel(): number {
    let lvl = 0;
    while (Math.random() < SkipList.P && lvl < SkipList.MAX_LEVEL) {
      lvl++;
    }
    return lvl;
  }

  insert(value: T): void {
    const update: Array<SkipListNode<T>> = new Array(SkipList.MAX_LEVEL + 1);
    let current = this._head;

    for (let i = this._level; i >= 0; i--) {
      while (current.forwards[i] && this._compare(current.forwards[i]!.value as T, value) < 0) {
        current = current.forwards[i]!;
      }
      update[i] = current;
    }

    current = current.forwards[0]!;
    if (current && this._compare(current.value as T, value) === 0) {
      // Value already exists, do nothing or update as needed
      return;
    } else {
      const lvl = this.randomLevel();
      if (lvl > this._level) {
        for (let i = this._level + 1; i <= lvl; i++) {
          update[i] = this._head;
        }
        this._level = lvl;
      }
      const newNode = new SkipListNode<T>(value, lvl);
      for (let i = 0; i <= lvl; i++) {
        newNode.forwards[i] = update[i].forwards[i];
        update[i].forwards[i] = newNode;
      }
      this._size++;
    }
  }

  has(value: T): boolean {
    let current = this._head;
    for (let i = this._level; i >= 0; i--) {
      while (current.forwards[i] && this._compare(current.forwards[i]!.value as T, value) < 0) {
        current = current.forwards[i]!;
      }
    }
    current = current.forwards[0]!;
    return !!current && this._compare(current.value as T, value) === 0;
  }

  delete(value: T): boolean {
    const update: Array<SkipListNode<T>> = new Array(SkipList.MAX_LEVEL + 1);
    let current = this._head;
    for (let i = this._level; i >= 0; i--) {
      while (current.forwards[i] && this._compare(current.forwards[i]!.value as T, value) < 0) {
        current = current.forwards[i]!;
      }
      update[i] = current;
    }
    current = current.forwards[0]!;
    if (current && this._compare(current.value as T, value) === 0) {
      for (let i = 0; i <= this._level; i++) {
        if (update[i].forwards[i] !== current) break;
        update[i].forwards[i] = current.forwards[i];
      }
      while (this._level > 0 && !this._head.forwards[this._level]) {
        this._level--;
      }
      this._size--;
      return true;
    }
    return false;
  }

  get size(): number {
    return this._size;
  }

  clear(): void {
    this._head = new SkipListNode<T>(null, SkipList.MAX_LEVEL);
    this._level = 0;
    this._size = 0;
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this._head.forwards[0];
    while (current) {
      yield current.value as T;
      current = current.forwards[0];
    }
  }

  toArray(): T[] {
    return [...this];
  }
}
