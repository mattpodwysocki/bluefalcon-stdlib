import { describe, it, assert } from "vitest";
import { SafeAsyncObserver, asyncDispose } from "../../src/collections/asyncobserver.js";

describe("SafeAsyncObserver", () => {
  it("should call next for each value", async () => {
    const values: number[] = [];
    const observer = new SafeAsyncObserver<number>(async v => { values.push(v); });
    await observer.next(1);
    await observer.next(2);
    await observer.next(3);
    assert.deepEqual(values, [1, 2, 3]);
  });

  it("should call error and prevent further calls", async () => {
    const values: number[] = [];
    let errorCalled = false;
    const observer = new SafeAsyncObserver<number>(
      async v => { values.push(v); },
      async () => { errorCalled = true; }
    );
    await observer.next(1);
    await observer.error(new Error("fail"));
    await observer.next(2);
    await observer.error("again");
    await observer.complete();
    assert.deepEqual(values, [1]);
    assert.equal(errorCalled, true);
  });

  it("should call complete and prevent further calls", async () => {
    const values: number[] = [];
    let completeCalled = false;
    const observer = new SafeAsyncObserver<number>(
      async v => { values.push(v); },
      undefined,
      async () => { completeCalled = true; }
    );
    await observer.next(1);
    await observer.complete();
    await observer.next(2);
    await observer.complete();
    await observer.error("should not call");
    assert.deepEqual(values, [1]);
    assert.equal(completeCalled, true);
  });

  it("should allow error and complete handlers to be optional", async () => {
    const observer = new SafeAsyncObserver<number>(async () => {});
    await observer.next(1);
    await observer.complete();
    await observer.error("should not throw");
  });

  it("should prevent further calls after asyncDispose", async () => {
    const values: number[] = [];
    let errorCalled = false;
    let completeCalled = false;
    const observer = new SafeAsyncObserver<number>(
      async v => { values.push(v); },
      async () => { errorCalled = true; },
      async () => { completeCalled = true; }
    );
    await observer.next(1);
    await observer[asyncDispose]();
    await observer.next(2);
    await observer.error("should not call");
    await observer.complete();
    assert.deepEqual(values, [1]);
    assert.equal(errorCalled, false);
    assert.equal(completeCalled, false);
  });
});
