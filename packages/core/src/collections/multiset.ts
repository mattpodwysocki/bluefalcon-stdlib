export class MultiSet<T> implements Iterable<T> {
  private _map = new Map<T, number>();

  add(item: T, count = 1): void {
    if (count <= 0) return;
    this._map.set(item, (this._map.get(item) ?? 0) + count);
  }

delete(item: T, count = 1): boolean {
  if (count <= 0) return false;
  const current = this._map.get(item);
  if (current === undefined) return false;
  if (count >= current) {
    this._map.delete(item);
    return true;
  } else {
    this._map.set(item, current - count);
    return true;
  }
}

  count(item: T): number {
    return this._map.get(item) ?? 0;
  }

  has(item: T): boolean {
    return this._map.has(item);
  }

  get size(): number {
    let total = 0;
    for (const cnt of this._map.values()) total += cnt;
    return total;
  }

  get uniqueSize(): number {
    return this._map.size;
  }

  clear(): void {
    this._map.clear();
  }

  *[Symbol.iterator](): Iterator<T> {
    for (const [item, count] of this._map.entries()) {
      for (let i = 0; i < count; i++) {
        yield item;
      }
    }
  }

  toArray(): T[] {
    return [...this];
  }

  entries(): IterableIterator<[T, number]> {
    return this._map.entries();
  }
}
