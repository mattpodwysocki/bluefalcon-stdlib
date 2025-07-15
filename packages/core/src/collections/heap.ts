import { Comparator } from "./collection.js";

export class Heap<T> implements Iterable<T> {
  private _data: T[] = [];
  private _compare: Comparator<T>;

  constructor(compareFn?: Comparator<T>) {
    // Default: min-heap
    this._compare = compareFn ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  push(item: T): void {
    this._data.push(item);
    this._bubbleUp(this._data.length - 1);
  }

  pop(): T | undefined {
    if (this._data.length === 0) return undefined;
    const top = this._data[0];
    const end = this._data.pop()!;
    if (this._data.length > 0) {
      this._data[0] = end;
      this._bubbleDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this._data[0];
  }

  get size(): number {
    return this._data.length;
  }

  isEmpty(): boolean {
    return this._data.length === 0;
  }

  clear(): void {
    this._data.length = 0;
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* [...this._data].sort(this._compare);
  }

  toArray(): T[] {
    return [...this._data].sort(this._compare);
  }

  private _bubbleUp(index: number): void {
    const item = this._data[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this._data[parentIndex];
      if (this._compare(item, parent) >= 0) break;
      this._data[index] = parent;
      index = parentIndex;
    }
    this._data[index] = item;
  }

  private _bubbleDown(index: number): void {
    const length = this._data.length;
    const item = this._data[index];
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this._compare(this._data[left], this._data[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this._compare(this._data[right], this._data[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;
      this._data[index] = this._data[smallest];
      index = smallest;
    }
    this._data[index] = item;
  }
}
