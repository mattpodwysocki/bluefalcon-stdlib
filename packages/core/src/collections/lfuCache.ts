type LFUNode<K, V> = {
  key: K;
  value: V;
  freq: number;
};

export class LFUCache<K, V> {
  private _maxSize: number;
  private _cache = new Map<K, LFUNode<K, V>>();
  private _freqMap = new Map<number, Set<K>>();
  private _minFreq = 0;

  constructor(maxSize: number = 100) {
    if (maxSize <= 0) throw new Error("maxSize must be greater than 0");
    this._maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const node = this._cache.get(key);
    if (!node) return undefined;
    this._updateFreq(node);
    return node.value;
  }

  set(key: K, value: V): void {
    if (this._cache.has(key)) {
      const node = this._cache.get(key)!;
      node.value = value;
      this._updateFreq(node);
      return;
    }
    if (this._cache.size >= this._maxSize) {
      this._evict();
    }
    const node: LFUNode<K, V> = { key, value, freq: 1 };
    this._cache.set(key, node);
    if (!this._freqMap.has(1)) this._freqMap.set(1, new Set());
    this._freqMap.get(1)!.add(key);
    this._minFreq = 1;
  }

  has(key: K): boolean {
    return this._cache.has(key);
  }

  delete(key: K): boolean {
    const node = this._cache.get(key);
    if (!node) return false;
    this._freqMap.get(node.freq)!.delete(key);
    if (this._freqMap.get(node.freq)!.size === 0) {
      this._freqMap.delete(node.freq);
      if (this._minFreq === node.freq) {
        this._minFreq = Math.min(...this._freqMap.keys(), 1);
      }
    }
    return this._cache.delete(key);
  }

  clear(): void {
    this._cache.clear();
    this._freqMap.clear();
    this._minFreq = 0;
  }

  get size(): number {
    return this._cache.size;
  }

  keys(): IterableIterator<K> {
    return this._cache.keys();
  }

  values(): IterableIterator<V> {
    function* gen(cache: Map<K, LFUNode<K, V>>): IterableIterator<V> {
      for (const node of cache.values()) yield node.value;
    }
    return gen(this._cache);
  }

  entries(): IterableIterator<[K, V]> {
    function* gen(cache: Map<K, LFUNode<K, V>>): IterableIterator<[K, V]> {
      for (const [k, node] of cache.entries()) yield [k, node.value];
    }
    return gen(this._cache);
  }

  private _updateFreq(node: LFUNode<K, V>): void {
    const oldFreq = node.freq;
    node.freq++;
    this._freqMap.get(oldFreq)!.delete(node.key);
    if (this._freqMap.get(oldFreq)!.size === 0) {
      this._freqMap.delete(oldFreq);
      if (this._minFreq === oldFreq) {
        this._minFreq = oldFreq + 1;
      }
    }
    if (!this._freqMap.has(node.freq)) this._freqMap.set(node.freq, new Set());
    this._freqMap.get(node.freq)!.add(node.key);
  }

  private _evict(): void {
    const keys = this._freqMap.get(this._minFreq);
    if (!keys) return;
    const keyToEvict = keys.values().next().value;
    if (keyToEvict !== undefined) {
      keys.delete(keyToEvict);
      if (keys.size === 0) {
        this._freqMap.delete(this._minFreq);
      }
      this._cache.delete(keyToEvict);
    }
  }
}
