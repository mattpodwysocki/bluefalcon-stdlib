export class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;
  prev: LinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> implements Iterable<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  add(value: T): LinkedListNode<T> {
    const node = new LinkedListNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      if (this.tail) this.tail.next = node;
      this.tail = node;
    }
    this._size++;
    return node;
  }

  remove(node: LinkedListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
    node.next = node.prev = null;
    this._size--;
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  clear(): void {
    this.head = this.tail = null;
    this._size = 0;
  }

  toArray(): T[] {
    return [...this];
  }
}
