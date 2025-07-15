import { describe, it, assert, expect, vi } from "vitest";
import {
  isAsyncDisposable,
  createAsyncDisposable,
  createEmptyDisposableAsync,
  disposeAllAsync,
  SingleAssignmentAsyncDisposable,
  SerialAsyncDisposable,
  CompositeAsyncDisposable,
  BinaryAsyncDisposable,
} from "../../src/concurrency/asyncdisposable.js";

describe("AsyncDisposable utilities", () => {
  it("should create and dispose a simple async disposable", async () => {
    let disposed = false;
    const d = createAsyncDisposable(async () => { disposed = true; });
    assert.equal(disposed, false);
    await d[Symbol.asyncDispose]();
    assert.equal(disposed, true);
    // Should be idempotent
    await d[Symbol.asyncDispose]();
    assert.equal(disposed, true);
  });

  it("should create an empty async disposable", async () => {
    const d = createEmptyDisposableAsync();
    await d[Symbol.asyncDispose]();
  });

  it("should detect async disposable objects", () => {
    const d = createEmptyDisposableAsync();
    assert.equal(isAsyncDisposable(d), true);
    assert.equal(isAsyncDisposable({}), false);
    assert.equal(isAsyncDisposable(null), false);
  });

  it("disposeAllAsync: should dispose all async disposables", async () => {
    let disposed1 = false, disposed2 = false;
    const d1 = createAsyncDisposable(async () => { disposed1 = true; });
    const d2 = createAsyncDisposable(async () => { disposed2 = true; });
    await disposeAllAsync([d1, d2]);
    assert.equal(disposed1, true);
    assert.equal(disposed2, true);
  });
});

describe("SingleAssignmentAsyncDisposable", () => {
  it("calls dispose on assigned disposable when disposed", async () => {
    const fn = vi.fn();
    const d = new SingleAssignmentAsyncDisposable();
    await d.set(createAsyncDisposable(async () => { fn(); }));
    await d[Symbol.asyncDispose]();
    expect(fn).toHaveBeenCalledOnce();
  });

  it("throws if set is called twice", () => {
    const d = new SingleAssignmentAsyncDisposable();
    d.set(createAsyncDisposable(async () => {}));
    expect(() => d.set(createAsyncDisposable(async () => {}))).rejects.toThrow();
  });

  it("immediately disposes if set after disposal", () => {
    const fn = vi.fn();
    const d = new SingleAssignmentAsyncDisposable();
    d[Symbol.asyncDispose]();
    d.set(createAsyncDisposable(async () => { fn(); }));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("get returns the assigned disposable", async () => {
    const disp = createAsyncDisposable(async () => {});
    const d = new SingleAssignmentAsyncDisposable();
    await d.set(disp);
    expect(await d.get()).toBe(disp);
  });

  it("isDisposed returns true after disposal", async () => {
    const d = new SingleAssignmentAsyncDisposable();
    await d[Symbol.asyncDispose]();
    expect(d.isDisposed()).toBe(true);
  });
});

describe("SerialAsyncDisposable", () => {
  it("should dispose previous on set", async () => {
    let disposed1 = false, disposed2 = false;
    const d1 = createAsyncDisposable(async () => { disposed1 = true; });
    const d2 = createAsyncDisposable(async () => { disposed2 = true; });
    const sd = new SerialAsyncDisposable();
    await sd.set(d1);
    assert.equal(await sd.get(), d1);
    await sd.set(d2);
    assert.equal(disposed1, true);
    assert.equal(disposed2, false);
    await sd[Symbol.asyncDispose]();
    assert.equal(disposed2, true);
  });

  it("should dispose immediately if set after disposal", async () => {
    let disposed = false;
    const sd = new SerialAsyncDisposable();
    await sd[Symbol.asyncDispose]();
    const d = createAsyncDisposable(async () => { disposed = true; });
    await sd.set(d);
    assert.equal(disposed, true);
  });
});

describe("CompositeAsyncDisposable", () => {
  it("should add, delete, and dispose all", async () => {
    let disposed1 = false, disposed2 = false;
    const d1 = createAsyncDisposable(async () => { disposed1 = true; });
    const d2 = createAsyncDisposable(async () => { disposed2 = true; });
    const cd = new CompositeAsyncDisposable();
    await cd.add(d1);
    await cd.add(d2);
    assert.equal(await cd.delete(d1), true);
    assert.equal(disposed1, true);
    await cd[Symbol.asyncDispose]();
    assert.equal(disposed2, true);
    // Add after disposed should immediately dispose
    let disposed3 = false;
    const d3 = createAsyncDisposable(async () => { disposed3 = true; });
    await cd.add(d3);
    assert.equal(disposed3, true);
  });

  it("should report isDisposed", async () => {
    const cd = new CompositeAsyncDisposable();
    assert.equal(cd.isDisposed, false);
    await cd[Symbol.asyncDispose]();
    assert.equal(cd.isDisposed, true);
  });
});

describe("BinaryAsyncDisposable", () => {
  it("should dispose both disposables", async () => {
    let disposed1 = false, disposed2 = false;
    const d1 = createAsyncDisposable(async () => { disposed1 = true; });
    const d2 = createAsyncDisposable(async () => { disposed2 = true; });
    const bd = new BinaryAsyncDisposable(d1, d2);
    await bd[Symbol.asyncDispose]();
    assert.equal(disposed1, true);
    assert.equal(disposed2, true);
    // Should be idempotent
    await bd[Symbol.asyncDispose]();
    assert.equal(bd.isDisposed, true);
  });

  it("should handle null disposables gracefully", async () => {
    const bd = new BinaryAsyncDisposable(null, null);
    await bd[Symbol.asyncDispose]();
    assert.equal(bd.isDisposed, true);
  });
});
