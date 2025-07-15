export function isAsyncDisposable(value: unknown): value is AsyncDisposable {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.asyncDispose in value &&
    typeof (value as { [Symbol.asyncDispose]: unknown })[Symbol.asyncDispose] === "function"
  );
}

export async function disposeAllAsync(disposables: Iterable<AsyncDisposable | unknown>): Promise<void> {
  await Promise.all(
    Array.from(disposables)
      .filter(isAsyncDisposable)
      .map((disposable) => disposable[Symbol.asyncDispose]())
  );
}

export function createAsyncDisposable(disposeFn: () => Promise<void>): AsyncDisposable {
  let isDisposed = false;

  return {
    [Symbol.asyncDispose]: async () => {
      if (!isDisposed) {
        isDisposed = true;
        await disposeFn();
      }
    },
  };
}

export function createEmptyDisposableAsync(): AsyncDisposable {
  return {
    [Symbol.asyncDispose]: async () => {
      /* no-op */
    },
  };
}

export class SingleAssignmentAsyncDisposable implements AsyncDisposable {
  private _disposed = false;
  private _disposable: AsyncDisposable | null = null;

  constructor(disposable?: AsyncDisposable) {
    if (disposable) {
      this._disposable = disposable;
    }
  }

  async get(): Promise<AsyncDisposable | null> {
    return this._disposable;
  }

  async set(disposable: AsyncDisposable) {
    if (this._disposable) {
      throw new Error("Disposable has already been assigned.");
    }

    if (this._disposed) {
      if (disposable) {
        await disposable[Symbol.asyncDispose]();
      }
    } else {
      this._disposable = disposable;
    }

    this._disposable = disposable;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this._disposed) {
      this._disposed = true;
      if (this._disposable) {
        await this._disposable[Symbol.asyncDispose]();
      }
      this._disposable = null;
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}

export class SerialAsyncDisposable implements AsyncDisposable {
  private _disposed = false;
  private _current: AsyncDisposable | null = null;

  async get(): Promise<AsyncDisposable | null> {
    return this._current;
  }

  async set(disposable: AsyncDisposable | null) {
    if (!this._disposed) {
      const previous = this._current;
      this._current = disposable;
      if (previous) {
        await previous[Symbol.asyncDispose]();
      }
    }

    if (this._disposed) {
      if (disposable) {
        await disposable[Symbol.asyncDispose]();
      }
    }
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this._disposed) {
      this._disposed = true;
      if (this._current) {
        await this._current[Symbol.asyncDispose]();
        this._current = null;
      }
    }
  }

  isDisposed(): boolean {
    return this._disposed;
  }
}

export class CompositeAsyncDisposable implements AsyncDisposable {
  private _disposables: Set<AsyncDisposable> = new Set();
  private _isDisposed = false;

  async add(disposable: AsyncDisposable): Promise<void> {
    if (this._isDisposed) {
      await disposable[Symbol.asyncDispose]();
      return;
    }
    this._disposables.add(disposable);
  }

  async delete(disposable: AsyncDisposable): Promise<boolean> {
    if (this._disposables.has(disposable)) {
      this._disposables.delete(disposable);
      await disposable[Symbol.asyncDispose]();
      return true;
    }
    return false;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this._isDisposed) {
      this._isDisposed = true;
      await disposeAllAsync(this._disposables);
      this._disposables.clear();
    }
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }
}

export class BinaryAsyncDisposable implements AsyncDisposable {
  private _first: AsyncDisposable | null;
  private _second: AsyncDisposable | null;
  private _isDisposed = false;

  constructor(first: AsyncDisposable | null, second: AsyncDisposable | null) {
    this._first = first;
    this._second = second;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (!this._isDisposed) {
      this._isDisposed = true;
      await disposeAllAsync([this._first, this._second]);
      this._first = null;
      this._second = null;
    }
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }
}
