import { describe, it, expect, vi } from "vitest";
import {
  isDisposable,
  disposeAll,
  createDisposable,
  createEmptyDisposable,
  SingleAssignmentDisposable,
  SerialDisposable,
  CompositeDisposable,
  BinaryDisposable,
} from "../../src/concurrency/disposable.js";

describe("isDisposable", () => {
  it("returns true for objects with Symbol.dispose function", () => {
    const d = { [Symbol.dispose]: () => {} };
    expect(isDisposable(d)).toBe(true);
  });
  it("returns false for non-objects", () => {
    expect(isDisposable(null)).toBe(false);
    expect(isDisposable(undefined)).toBe(false);
    expect(isDisposable(42)).toBe(false);
    expect(isDisposable("foo")).toBe(false);
  });
  it("returns false for objects without Symbol.dispose", () => {
    expect(isDisposable({})).toBe(false);
    expect(isDisposable({ dispose: () => {} })).toBe(false);
  });
});

describe("disposeAll", () => {
  it("calls Symbol.dispose on all disposables in iterable", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const d1 = { [Symbol.dispose]: fn1 };
    const d2 = { [Symbol.dispose]: fn2 };
    disposeAll([d1, d2]);
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });
  it("ignores non-disposable values", () => {
    expect(() => disposeAll([null, 42, {}, undefined])).not.toThrow();
  });
});

describe("createDisposable", () => {
  it("calls the provided function on dispose", () => {
    const fn = vi.fn();
    const d = createDisposable(fn);
    d[Symbol.dispose]();
    expect(fn).toHaveBeenCalledOnce();
  });
  it("is idempotent", () => {
    const fn = vi.fn();
    const d = createDisposable(fn);
    d[Symbol.dispose]();
    d[Symbol.dispose]();
    expect(fn).toHaveBeenCalledOnce();
  });
});

describe("createEmptyDisposable", () => {
  it("returns a disposable that does nothing", () => {
    const d = createEmptyDisposable();
    expect(() => d[Symbol.dispose]()).not.toThrow();
  });
});

describe("SingleAssignmentDisposable", () => {
  it("calls dispose on assigned disposable when disposed", () => {
    const fn = vi.fn();
    const d = new SingleAssignmentDisposable();
    d.set(createDisposable(fn));
    d[Symbol.dispose]();
    expect(fn).toHaveBeenCalledOnce();
  });

  it("throws if set is called twice", () => {
    const d = new SingleAssignmentDisposable();
    d.set(createDisposable(() => {}));
    expect(() => d.set(createDisposable(() => {}))).toThrow();
  });

  it("immediately disposes if set after disposal", () => {
    const fn = vi.fn();
    const d = new SingleAssignmentDisposable();
    d[Symbol.dispose]();
    d.set(createDisposable(fn));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("get returns the assigned disposable", () => {
    const disp = createDisposable(() => {});
    const d = new SingleAssignmentDisposable();
    d.set(disp);
    expect(d.get()).toBe(disp);
  });

  it("isDisposed returns true after disposal", () => {
    const d = new SingleAssignmentDisposable();
    d[Symbol.dispose]();
    expect(d.isDisposed()).toBe(true);
  });
});

describe("SerialDisposable", () => {
  it("disposes previous disposable when set", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const d = new SerialDisposable();
    d.set(createDisposable(fn1));
    d.set(createDisposable(fn2));
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).not.toHaveBeenCalled();
  });
  it("immediately disposes if set after disposal", () => {
    const fn = vi.fn();
    const d = new SerialDisposable();
    d[Symbol.dispose]();
    d.set(createDisposable(fn));
    expect(fn).toHaveBeenCalledOnce();
  });
  it("get returns the current disposable", () => {
    const disp = createDisposable(() => {});
    const d = new SerialDisposable();
    d.set(disp);
    expect(d.get()).toBe(disp);
  });
  it("isDisposed returns true after disposal", () => {
    const d = new SerialDisposable();
    d[Symbol.dispose]();
    expect(d.isDisposed()).toBe(true);
  });
  it("disposes current on dispose", () => {
    const fn = vi.fn();
    const d = new SerialDisposable();
    d.set(createDisposable(fn));
    d[Symbol.dispose]();
    expect(fn).toHaveBeenCalledOnce();
  });
});

describe("CompositeDisposable", () => {
  it("disposes all added disposables on dispose", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const d = new CompositeDisposable();
    d.add(createDisposable(fn1));
    d.add(createDisposable(fn2));
    d[Symbol.dispose]();
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });
  it("disposes immediately if add after disposal", () => {
    const fn = vi.fn();
    const d = new CompositeDisposable();
    d[Symbol.dispose]();
    d.add(createDisposable(fn));
    expect(fn).toHaveBeenCalledOnce();
  });
  it("delete disposes and removes the disposable", () => {
    const fn = vi.fn();
    const disp = createDisposable(fn);
    const d = new CompositeDisposable();
    d.add(disp);
    expect(d.delete(disp)).toBe(true);
    expect(fn).toHaveBeenCalledOnce();
    expect(d.size).toBe(0);
  });
  it("delete returns false if not present", () => {
    const d = new CompositeDisposable();
    expect(d.delete(createDisposable(() => {}))).toBe(false);
  });
  it("isDisposed returns true after disposal", () => {
    const d = new CompositeDisposable();
    d[Symbol.dispose]();
    expect(d.isDisposed()).toBe(true);
  });
  it("size returns number of contained disposables", () => {
    const d = new CompositeDisposable();
    d.add(createDisposable(() => {}));
    d.add(createDisposable(() => {}));
    expect(d.size).toBe(2);
  });
});

describe("BinaryDisposable", () => {
  it("disposes both disposables on dispose", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const d = new BinaryDisposable(createDisposable(fn1), createDisposable(fn2));
    d[Symbol.dispose]();
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });
  it("isDisposed returns true after disposal", () => {
    const d = new BinaryDisposable(createDisposable(() => {}), createDisposable(() => {}));
    d[Symbol.dispose]();
    expect(d.isDisposed()).toBe(true);
  });
  it("is idempotent", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const d = new BinaryDisposable(createDisposable(fn1), createDisposable(fn2));
    d[Symbol.dispose]();
    d[Symbol.dispose]();
    expect(fn1).toHaveBeenCalledOnce();
    expect(fn2).toHaveBeenCalledOnce();
  });
});
