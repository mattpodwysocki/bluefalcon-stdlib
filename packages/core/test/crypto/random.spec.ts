import { describe, it, assert } from "vitest";
import { getRandomIntegerInclusive } from "../../src/crypto/random.js";

describe("getRandomIntegerInclusive", () => {
  it("should return a number within the specified range", () => {
    for (let i = 0; i < 100; i++) {
      const value = getRandomIntegerInclusive(1, 10);
      assert.ok(value >= 1 && value <= 10, `Value ${value} is not in [1, 10]`);
    }
  });

  it("should work when min and max are equal", () => {
    for (let i = 0; i < 10; i++) {
      const value = getRandomIntegerInclusive(5, 5);
      assert.equal(value, 5);
    }
  });

  it("should work with negative numbers", () => {
    for (let i = 0; i < 100; i++) {
      const value = getRandomIntegerInclusive(-5, 5);
      assert.ok(value >= -5 && value <= 5, `Value ${value} is not in [-5, 5]`);
    }
  });

  it("should throw if range is negative", () => {
    assert.throws(() => getRandomIntegerInclusive(10, 1), /Invalid range/);
  });
});
