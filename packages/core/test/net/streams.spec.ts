import { describe, it, assert } from "vitest";
import type { NodeJSReadableStream } from "../../src/net/streams.js";
import { createStream, ensureAsyncIterable  } from "../../src/net/streams.js";

describe("createStream", () => {
  it("should yield values from an async iterator", async () => {
    async function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    const stream = createStream(gen(), async () => {});
    const reader = stream.getReader();
    const results: number[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      results.push(value);
    }
    assert.deepEqual(results, [1, 2, 3]);
  });

  it("should support async iteration via Symbol.asyncIterator", async () => {
    async function* gen() {
      yield "a";
      yield "b";
    }
    const stream = createStream(gen(), async () => {});
    const out: string[] = [];
    for await (const v of stream) {
      out.push(v);
    }
    assert.deepEqual(out, ["a", "b"]);
  });

  it("should support .values() as async iterable", async () => {
    async function* gen() {
      yield 10;
      yield 20;
    }
    const stream = createStream(gen(), async () => {});
    const out: number[] = [];
    for await (const v of stream.values()) {
      out.push(v);
    }
    assert.deepEqual(out, [10, 20]);
  });

  it("should support async disposal", async () => {
    let disposed = false;
    async function* gen() {
      yield 1;
      yield 2;
    }
    const stream = createStream(gen(), async () => { disposed = true; });
    // Dispose before reading all values
    await stream[Symbol.asyncDispose]();
    assert.equal(disposed, true);
  });
});

describe("ensureAsyncIterable", () => {
  it("should wrap a ReadableStream and provide async iteration", async () => {
    async function* gen(): AsyncGenerator<number> {
      yield 1;
      yield 2;
    }
    const stream = createStream(gen(), async () => {});
    const { iterable, cancel } = ensureAsyncIterable(stream);
    const out: number[] = [];
    for await (const v of iterable as AsyncIterable<number>) {
      out.push(v);
    }
    assert.deepEqual(out, [1, 2]);
    await cancel();
  });

  it("should wrap a NodeJSReadableStream and provide cancel", async () => {
    let destroyed = false;
    const fakeNodeStream = {
      destroy: () => { destroyed = true; },
      [Symbol.asyncIterator]: async function* () { yield 1; }
    };
    const { iterable, cancel } = ensureAsyncIterable(fakeNodeStream as NodeJSReadableStream);
    const out: number[] = [];
    for await (const v of iterable as AsyncIterable<number>) {
      out.push(v);
      break; // only read one
    }
    await cancel();
    assert.equal(destroyed, true);
  });
});
