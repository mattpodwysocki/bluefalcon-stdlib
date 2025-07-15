/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Observer<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
  dispose(): void;
}

export class SafeObserver<T> implements Observer<T> {
  private closed = false;
  private readonly _next: (value: T) => void;
  private readonly _error: (err: any) => void;
  private readonly _complete: () => void;

  constructor(
    next: (value: T) => void,
    error: (err: any) => void = () => {},
    complete: () => void = () => {}
  ) {
    this._next = next;
    this._error = error;
    this._complete = complete;
  }

  next(value: T): void {
    if (!this.closed) this._next(value);
  }

  error(err: any): void {
    if (!this.closed) {
      this.closed = true;
      this._error(err);
    }
  }

  complete(): void {
    if (!this.closed) {
      this.closed = true;
      this._complete();
    }
  }

  dispose(): void {
    this.closed = true;
  }
}
