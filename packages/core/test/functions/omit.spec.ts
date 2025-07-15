import { describe, it, assert } from "vitest";
import { omit } from "../../src/functions/omit.js";

describe("omit", () => {
  it("should omit specified keys from an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ["a", "c"]);
    assert.deepEqual(result, { b: 2 });
  });

  it("should return the same object if no keys are omitted", () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, []);
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it("should ignore keys that do not exist on the object", () => {
    const obj = { a: 1, b: 2 } as { a: number; b: number; c?: number };
    const result = omit(obj, ["c"] as ("a" | "b" | "c")[]);
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it("should work with objects with string and number keys", () => {
    const obj: Record<string | number, string> = { 1: "one", two: "two" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = omit(obj, [1 as any]);
    assert.deepEqual(result, { two: "two" });
  });

  it("should not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, ["a"]);
    assert.notEqual(result, obj);
    assert.equal(obj.a, 1);
  });
});
