import { describe, it, assert } from "vitest";
import { tap } from "../../src/collections/tap.js";

describe("tap", () => {
  it("should yield all items unchanged", () => {
    const arr = [1, 2, 3];
    const result = Array.from(tap(arr, () => {}));
    assert.deepEqual(result, [1, 2, 3]);
  });

  it("should call the side-effect function for each item", () => {
    const arr = [1, 2, 3];
    const seen: number[] = [];
    Array.from(tap(arr, x => seen.push(x * 2)));
    assert.deepEqual(seen, [2, 4, 6]);
  });

  it("should work with any iterable", () => {
    function* gen() {
      yield "a";
      yield "b";
    }
    const result: string[] = [];
    Array.from(tap(gen(), x => result.push(x)));
    assert.deepEqual(result, ["a", "b"]);
  });

  it("should allow chaining with other iterable utilities", () => {
    const arr = [1, 2, 3];
    const seen: number[] = [];
    const mapped = Array.from(tap(arr, x => seen.push(x))).map(x => x * 10);
    assert.deepEqual(mapped, [10, 20, 30]);
    assert.deepEqual(seen, [1, 2, 3]);
  });
});
