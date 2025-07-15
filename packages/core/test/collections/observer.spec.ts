import { describe, it, assert } from "vitest";
import { SafeObserver } from "../../src/collections/observer.js";

describe("SafeObserver", () => {
  it("should call next for each value", () => {
    const values: number[] = [];
    const observer = new SafeObserver<number>(v => values.push(v));
    observer.next(1);
    observer.next(2);
    observer.next(3);
    assert.deepEqual(values, [1, 2, 3]);
  });

  it("should call error and prevent further calls", () => {
    const values: number[] = [];
    let errorCalled = false;
    const observer = new SafeObserver<number>(
      v => values.push(v),
      () => { errorCalled = true; }
    );
    observer.next(1);
    observer.error(new Error("fail"));
    observer.next(2);
    observer.error("again");
    observer.complete();
    assert.deepEqual(values, [1]);
    assert.equal(errorCalled, true);
  });

  it("should call complete and prevent further calls", () => {
    const values: number[] = [];
    let completeCalled = false;
    const observer = new SafeObserver<number>(
      v => values.push(v),
      undefined,
      () => { completeCalled = true; }
    );
    observer.next(1);
    observer.complete();
    observer.next(2);
    observer.complete();
    observer.error("should not call");
    assert.deepEqual(values, [1]);
    assert.equal(completeCalled, true);
  });

  it("should allow error and complete handlers to be optional", () => {
    const observer = new SafeObserver<number>(() => {});
    observer.next(1);
    observer.complete();
    observer.error("should not throw");
  });

  it("should prevent further calls after dispose", () => {
    const values: number[] = [];
    let errorCalled = false;
    let completeCalled = false;
    const observer = new SafeObserver<number>(
      v => values.push(v),
      () => { errorCalled = true; },
      () => { completeCalled = true; }
    );
    observer.next(1);
    observer.dispose();
    observer.next(2);
    observer.error("should not call");
    observer.complete();
    assert.deepEqual(values, [1]);
    assert.equal(errorCalled, false);
    assert.equal(completeCalled, false);
  });
});
