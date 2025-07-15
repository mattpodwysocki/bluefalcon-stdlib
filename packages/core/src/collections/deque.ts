export class DoubleEndedQueue<T> implements Iterable<T> {
  private _items: T[] = [];

  pushBack(item: T): void {
    this._items.push(item);
  }

  pushFront(item: T): void {
    this._items.unshift(item);
  }

  popBack(): T | undefined {
    return this._items.pop();
  }

  popFront(): T | undefined {
    return this._items.shift();
  }

  peekBack(): T | undefined {
    return this._items[this._items.length - 1];
  }

  peekFront(): T | undefined {
    return this._items[0];
  }

  get size(): number {
    return this._items.length;
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  clear(): void {
    this._items.length = 0;
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* this._items;
  }

  toArray(): T[] {
    return [...this._items];
  }
}
