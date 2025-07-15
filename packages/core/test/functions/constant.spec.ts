import { describe, it, assert } from "vitest";
import { constant } from "../../src/functions/constant.js";

describe("constant", () => {
  it("should always return the same number", () => {
    const alwaysFive = constant(5);
    assert.equal(alwaysFive(), 5);
    assert.equal(alwaysFive(), 5);
  });

  it("should always return the same string", () => {
    const alwaysHello = constant("hello");
    assert.equal(alwaysHello(), "hello");
    assert.equal(alwaysHello(), "hello");
  });

  it("should always return the same object reference", () => {
    const obj = { a: 1 };
    const alwaysObj = constant(obj);
    assert.strictEqual(alwaysObj(), obj);
    assert.strictEqual(alwaysObj(), obj);
  });

  it("should always return undefined if given undefined", () => {
    const alwaysUndef = constant(undefined);
    assert.equal(alwaysUndef(), undefined);
  });

  it("should always return null if given null", () => {
    const alwaysNull = constant(null);
    assert.equal(alwaysNull(), null);
  });
});
