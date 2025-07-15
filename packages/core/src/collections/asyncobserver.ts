/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncDispose = Symbol.for("asyncDispose");

export interface AsyncObserver<T> {
  next(value: T): Promise<void>;
  error(err: any): Promise<void>;
  complete(): Promise<void>;
  [asyncDispose](): Promise<void>;
}

export class SafeAsyncObserver<T> implements AsyncObserver<T> {
  private closed = false;
  private readonly _next: (value: T) => Promise<void>;
  private readonly _error: (err: any) => Promise<void>;
  private readonly _complete: () => Promise<void>;

  constructor(
    next: (value: T) => Promise<void>,
    error: (err: any) => Promise<void> = async () => {},
    complete: () => Promise<void> = async () => {}
  ) {
    this._next = next;
    this._error = error;
    this._complete = complete;
  }

  async next(value: T): Promise<void> {
    if (!this.closed) await this._next(value);
  }

  async error(err: any): Promise<void> {
    if (!this.closed) {
      this.closed = true;
      await this._error(err);
    }
  }

  async complete(): Promise<void> {
    if (!this.closed) {
      this.closed = true;
      await this._complete();
    }
  }

  async [asyncDispose](): Promise<void> {
    this.closed = true;
  }
}
