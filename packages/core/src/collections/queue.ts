export class Queue<T> implements Iterable<T> {
  private _items: T[] = [];

  enqueue(item: T): void {
    this._items.push(item);
  }

  dequeue(): T | undefined {
    return this._items.shift();
  }

  peek(): T | undefined {
    return this._items[0];
  }

  get size(): number {
    return this._items.length;
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  clear(): void {
    this._items = [];
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const item of this._items) {
      yield item;
    }
  }

  toArray(): T[] {
    return [...this._items];
  }
}
