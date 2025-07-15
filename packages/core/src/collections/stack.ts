export class Stack<T> implements Iterable<T> {
  private _items: T[] = [];

  push(item: T): void {
    this._items.push(item);
  }

  pop(): T | undefined {
    return this._items.pop();
  }

  peek(): T | undefined {
    return this._items[this._items.length - 1];
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
    for (let i = this._items.length - 1; i >= 0; i--) {
      yield this._items[i];
    }
  }

  toArray(): T[] {
    return [...this._items];
  }
}
