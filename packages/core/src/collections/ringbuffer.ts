export class RingBuffer<T> implements Iterable<T> {
  private _buffer: (T | undefined)[];
  private _capacity: number;
  private _start = 0;
  private _end = 0;
  private _size = 0;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");
    this._capacity = capacity;
    this._buffer = new Array<T | undefined>(capacity);
  }

  push(item: T): void {
    this._buffer[this._end] = item;
    if (this._size === this._capacity) {
      this._start = (this._start + 1) % this._capacity; // Overwrite oldest
    } else {
      this._size++;
    }
    this._end = (this._end + 1) % this._capacity;
  }

  pop(): T | undefined {
    if (this._size === 0) return undefined;
    this._end = (this._end - 1 + this._capacity) % this._capacity;
    const item = this._buffer[this._end];
    this._buffer[this._end] = undefined;
    this._size--;
    return item;
  }

  shift(): T | undefined {
    if (this._size === 0) return undefined;
    const item = this._buffer[this._start];
    this._buffer[this._start] = undefined;
    this._start = (this._start + 1) % this._capacity;
    this._size--;
    return item;
  }

  peek(): T | undefined {
    if (this._size === 0) return undefined;
    return this._buffer[this._start];
  }

  get size(): number {
    return this._size;
  }

  get capacity(): number {
    return this._capacity;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  isFull(): boolean {
    return this._size === this._capacity;
  }

  clear(): void {
    this._buffer = new Array<T | undefined>(this._capacity);
    this._start = 0;
    this._end = 0;
    this._size = 0;
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0, idx = this._start; i < this._size; i++, idx = (idx + 1) % this._capacity) {
      yield this._buffer[idx] as T;
    }
  }

  toArray(): T[] {
    return [...this];
  }
}
