import { describe, it, assert } from "vitest";
import { not } from "../../src/functions/not.js";

describe("not", () => {
  it("should negate a predicate function", () => {
    const isEven = (n: number) => n % 2 === 0;
    const isOdd = not(isEven);
    assert.equal(isOdd(2), false);
    assert.equal(isOdd(3), true);
  });

  it("should work with predicates that take multiple arguments", () => {
    const isSumPositive = (a: number, b: number) => a + b > 0;
    const isSumNotPositive = not(isSumPositive);
    assert.equal(isSumNotPositive(1, 2), false);
    assert.equal(isSumNotPositive(-3, 2), true);
  });

  it("should work with always true/false predicates", () => {
    const alwaysTrue = () => true;
    const alwaysFalse = not(alwaysTrue);
    assert.equal(alwaysFalse(), false);

    const alwaysFalseFn = () => false;
    const alwaysTrueFn = not(alwaysFalseFn);
    assert.equal(alwaysTrueFn(), true);
  });
});
