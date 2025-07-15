import { Comparator, defaultComparer } from "./collection.js";

export class PriorityQueue<T> implements Iterable<T> {
  private _heap: T[] = [];
  private _compare: Comparator<T>;

  constructor(compareFn?: Comparator<T>) {
    // Default: min-heap (lower value = higher priority)
    this._compare = compareFn ?? defaultComparer;
  }

  enqueue(item: T): void {
    this._heap.push(item);
    this.bubbleUp(this._heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this._heap.length === 0) return undefined;
    const top = this._heap[0];
    const end = this._heap.pop()!;
    if (this._heap.length > 0) {
      this._heap[0] = end;
      this.bubbleDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this._heap[0];
  }

  get size(): number {
    return this._heap.length;
  }

  isEmpty(): boolean {
    return this._heap.length === 0;
  }

  clear(): void {
    this._heap = [];
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* [...this._heap].sort(this._compare);
  }

  toArray(): T[] {
    return [...this._heap].sort(this._compare);
  }

  private bubbleUp(index: number): void {
    const item = this._heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this._heap[parentIndex];
      if (this._compare(item, parent) >= 0) break;
      this._heap[index] = parent;
      index = parentIndex;
    }
    this._heap[index] = item;
  }

  private bubbleDown(index: number): void {
    const length = this._heap.length;
    const item = this._heap[index];
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < length && this._compare(this._heap[left], this._heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this._compare(this._heap[right], this._heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;
      this._heap[index] = this._heap[smallest];
      index = smallest;
    }
    this._heap[index] = item;
  }
}
