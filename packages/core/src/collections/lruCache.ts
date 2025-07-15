export class LRUCache<K, V> {
  private _cache = new Map<K, V>();
  private _maxSize: number;

  constructor(maxSize: number = 100) {
    if (maxSize <= 0) throw new Error("maxSize must be greater than 0");
    this._maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this._cache.has(key)) return undefined;
    const value = this._cache.get(key)!;
    this._cache.delete(key);
    this._cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this._cache.has(key)) {
      this._cache.delete(key);
    } else if (this._cache.size >= this._maxSize) {
      const lruKey = this._cache.keys().next().value;
      if (lruKey) {
        this._cache.delete(lruKey);
        this._cache.delete(lruKey);
      }
    }
    this._cache.set(key, value);
  }

  has(key: K): boolean {
    return this._cache.has(key);
  }

  delete(key: K): boolean {
    return this._cache.delete(key);
  }

  clear(): void {
    this._cache.clear();
  }

  get size(): number {
    return this._cache.size;
  }

  keys(): IterableIterator<K> {
    return this._cache.keys();
  }

  values(): IterableIterator<V> {
    return this._cache.values();
  }

  entries(): IterableIterator<[K, V]> {
    return this._cache.entries();
  }
}
