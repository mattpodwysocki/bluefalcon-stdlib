import { describe, it, assert } from "vitest";
import { identity } from "../../src/functions/identity.js";

describe("identity", () => {
  it("should return the same number", () => {
    assert.equal(identity(42), 42);
  });

  it("should return the same string", () => {
    assert.equal(identity("hello"), "hello");
  });

  it("should return the same object reference", () => {
    const obj = { a: 1 };
    assert.strictEqual(identity(obj), obj);
  });

  it("should return the same array reference", () => {
    const arr = [1, 2, 3];
    assert.strictEqual(identity(arr), arr);
  });

  it("should return undefined if given undefined", () => {
    assert.equal(identity(undefined), undefined);
  });

  it("should return null if given null", () => {
    assert.equal(identity(null), null);
  });
});
