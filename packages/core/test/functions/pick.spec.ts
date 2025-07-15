import { describe, it, assert } from "vitest";
import { pick } from "../../src/functions/pick.js";

describe("pick", () => {
  it("should pick specified keys from an object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ["a", "c"]);
    assert.deepEqual(result, { a: 1, c: 3 });
  });

  it("should return an empty object if no keys are specified", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, []);
    assert.deepEqual(result, {});
  });

  it("should ignore keys that do not exist on the object", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj as { a: number; b: number; c?: number }, ["a", "c"]);
    assert.deepEqual(result, { a: 1 });
  });

  it("should work with objects with string and number keys", () => {
    const obj: Record<string | number, string> = { 1: "one", two: "two" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = pick(obj, [1 as any, "two"]);
    assert.deepEqual(result, { 1: "one", two: "two" });
  });

  it("should not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ["a"]);
    result.a = 100;
    assert.equal(obj.a, 1);
  });
});
