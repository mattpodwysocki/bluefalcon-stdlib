import type { IncomingMessage } from "node:http";

/**
 * A Node.js Readable stream that also has a `destroy` method.
 */
export interface NodeJSReadableStream extends NodeJS.ReadableStream {
  /**
   * Destroy the stream. Optionally emit an 'error' event, and emit a
   * 'close' event (unless emitClose is set to false). After this call,
   * internal resources will be released.
   */
  destroy(error?: Error): void;
}

export function createStream<T>(
  asyncIter: AsyncIterableIterator<T>,
  cancel: () => PromiseLike<void>,
): ReadableStream<T> & AsyncDisposable & AsyncIterable<T> {
  const stream = iteratorToStream(asyncIter, cancel);
  return polyfillStream(stream, cancel);
}

function iteratorToStream<T>(
  iterator: AsyncIterableIterator<T>,
  cancel: () => PromiseLike<void>,
): ReadableStream<T> {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    cancel,
  });
}

function polyfillStream<T>(
  stream: ReadableStream<T>,
  dispose: () => PromiseLike<void>,
): ReadableStream<T> & AsyncIterable<T> & AsyncDisposable {
  makeAsyncIterable<T>(stream);
  makeAsyncDisposable(stream, dispose);
  return stream;
}

function makeAsyncDisposable<T>(
  webStream: unknown,
  dispose: () => PromiseLike<void>,
): asserts webStream is ReadableStream<T> & AsyncDisposable {
  const obj = webStream as Record<PropertyKey, unknown>;
  if (!obj[Symbol.asyncDispose]) {
    obj[Symbol.asyncDispose] = () => dispose();
  }
}

function makeAsyncIterable<T>(
  webStream: unknown,
): asserts webStream is ReadableStream<T> & AsyncIterable<T> {
  const obj = webStream as Record<PropertyKey, unknown>;
  if (!obj[Symbol.asyncIterator]) {
    obj[Symbol.asyncIterator] = () => toAsyncIterable(webStream as ReadableStream<T>);
  }

  if (!obj.values) {
    obj.values = () => toAsyncIterable(webStream as ReadableStream<T>);
  }
}

function isReadableStream(body: unknown): body is ReadableStream {
  return Boolean(
    body &&
      typeof (body as ReadableStream).getReader === "function" &&
      typeof (body as ReadableStream).tee === "function",
  );
}

async function* toAsyncIterable<T>(stream: ReadableStream<T>): AsyncIterableIterator<T> {
  const reader = stream.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    const cancelPromise = reader.cancel();
    reader.releaseLock();
    await cancelPromise;
  }
}

export function ensureAsyncIterable<T>(
  stream: IncomingMessage | NodeJSReadableStream | ReadableStream<T>,
): {
  cancel(): Promise<void>;
  iterable: AsyncIterable<T>;
} {
  if (isReadableStream(stream)) {
    makeAsyncIterable<T>(stream);
    return {
      cancel: () => stream.cancel(),
      iterable: stream,
    };
  } else {
    return {
      cancel: async () => {
        // socket could be null if the connection is already closed
        if ("socket" in stream && stream.socket) {
          stream.socket.end();
        } else {
          stream.destroy();
        }
      },
      iterable: stream as AsyncIterable<T>,
    };
  }
}
