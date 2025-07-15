/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This error is thrown when an asynchronous operation has been aborted.
 * Check for this error by testing the `name` that the name property of the
 * error matches `"AbortError"`.
 */
export class AbortError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AbortError";
  }
}

/**
 * Allows the request to be aborted upon firing of the "abort" event.
 * Compatible with the browser built-in AbortSignal and common polyfills.
 */
export interface AbortSignalLike {
  /**
   * Indicates if the signal has already been aborted.
   */
  readonly aborted: boolean;
  /**
   * Add new "abort" event listener, only support "abort" event.
   */
  addEventListener(
    type: "abort",
    listener: (this: AbortSignalLike, ev: any) => any,
    options?: any,
  ): void;
  /**
   * Remove "abort" event listener, only support "abort" event.
   */
  removeEventListener(
    type: "abort",
    listener: (this: AbortSignalLike, ev: any) => any,
    options?: any,
  ): void;
}

/**
 * Options related to abort controller.
 */
export interface AbortOptions {
  /**
   * The abortSignal associated with containing operation.
   */
  abortSignal?: AbortSignalLike;
  /**
   * The abort error message associated with containing operation.
   */
  abortErrorMsg?: string;
}

/**
 * Represents a function that returns a promise that can be aborted.
 */
export type AbortablePromiseBuilder<T> = (abortOptions: {
  abortSignal?: AbortSignalLike;
}) => Promise<T>;

/**
 * promise.race() wrapper that aborts rest of promises as soon as the first promise settles.
 */
export async function cancelablePromiseRace<T extends unknown[]>(
  abortablePromiseBuilders: AbortablePromiseBuilder<T[number]>[],
  options?: { abortSignal?: AbortSignalLike },
): Promise<T[number]> {
  const aborter = new AbortController();
  function abortHandler(): void {
    aborter.abort();
  }
  options?.abortSignal?.addEventListener("abort", abortHandler);
  try {
    return await Promise.race(
      abortablePromiseBuilders.map((p) => p({ abortSignal: aborter.signal })),
    );
  } finally {
    aborter.abort();
    options?.abortSignal?.removeEventListener("abort", abortHandler);
  }
}
