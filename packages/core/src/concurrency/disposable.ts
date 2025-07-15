export function isDisposable(value: unknown): value is Disposable {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.dispose in value &&
    typeof (value as { [Symbol.dispose]: unknown })[Symbol.dispose] === "function"
  );
}

export function disposeAll(disposables: Iterable<Disposable | unknown>): void {
  for (const disposable of disposables) {
    if (isDisposable(disposable)) {
      disposable[Symbol.dispose]();
    }
  }
}

export function createDisposable<T extends Disposable>(disposeFn: () => void): T {
  let isDisposed = false;

  return {
    [Symbol.dispose]: () => {
      if (!isDisposed) {
        isDisposed = true;
        disposeFn();
      }
    },
  } as T;
}

export function createEmptyDisposable(): Disposable {
  return {
    [Symbol.dispose]: () => {
      /* no-op */
    },
  };
}

export class SingleAssignmentDisposable implements Disposable {
  private _disposed = false;
  private _disposable: Disposable | null = null;

  constructor(disposable?: Disposable) {
    if (disposable) {
      this._disposable = disposable;
    }
  }

  get(): Disposable | null {
    return this._disposable;
  }

  set(disposable: Disposable) {
    if (this._disposable) {
      throw new Error("Disposable has already been assigned.");
    }

    if (this._disposed) {
      if (disposable) {
        disposable[Symbol.dispose]();
      }
    } else {
      this._disposable = disposable;
    }

    this._disposable = disposable;
  }

  [Symbol.dispose](): void {
    if (!this._disposed) {
      this._disposed = true;
      if (this._disposable) {
        this._disposable[Symbol.dispose]();
      }
      this._disposable = null;
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}

export class SerialDisposable implements Disposable {
  private _disposed = false;
  private _current: Disposable | null = null;

  get(): Disposable | null {
    return this._current;
  }

  set(disposable: Disposable | null) {
    if (!this._disposed) {
      const previous = this._current;
      this._current = disposable;
      if (previous) {
        previous[Symbol.dispose]();
      }
    }

    if (this._disposed) {
      if (disposable) {
        disposable[Symbol.dispose]();
      }
    }
  }

  [Symbol.dispose](): void {
    if (!this._disposed) {
      this._disposed = true;
      if (this._current) {
        this._current[Symbol.dispose]();
        this._current = null;
      }
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}

export class CompositeDisposable implements Disposable {
  private _disposables = new Set<Disposable>();
  private _disposed = false;

  add(disposable: Disposable): void {
    if (this._disposed) {
      disposable[Symbol.dispose]();
      return;
    }
    this._disposables.add(disposable);
  }

  delete(disposable: Disposable): boolean {
    if (this._disposables.has(disposable)) {
      this._disposables.delete(disposable);
      disposable[Symbol.dispose]();
      return true;
    }
    return false;
  }

  [Symbol.dispose](): void {
    if (!this._disposed) {
      this._disposed = true;
      for (const disposable of this._disposables) {
        disposable[Symbol.dispose]();
      }
      this._disposables.clear();
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }

  get size(): number {
    return this._disposables.size;
  }
}

export class BinaryDisposable implements Disposable {
  private _first: Disposable | null;
  private _second: Disposable | null;
  private _disposed = false;

  constructor(first: Disposable, second: Disposable) {
    this._first = first;
    this._second = second;
  }

  [Symbol.dispose](): void {
    if (!this._disposed) {
      this._disposed = true;
      this._first![Symbol.dispose]();
      this._first = null;
      this._second![Symbol.dispose]();
      this._second = null;
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}
