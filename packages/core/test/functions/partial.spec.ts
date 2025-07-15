import { describe, it, assert } from "vitest";
import { partial } from "../../src/functions/partial.js";

describe("partial", () => {
  it("should partially apply arguments to a function", () => {
    const add = (a: number, b: number, c: number) => a + b + c;
    const add5 = partial(add, 2, 3);
    assert.equal(add5(4), 9);
  });

  it("should work with no preset arguments", () => {
    const multiply = (a: number, b: number) => a * b;
    const mul = partial(multiply);
    assert.equal(mul(3, 4), 12);
  });

  it("should work with all arguments preset", () => {
    const greet = (name: string) => `Hello, ${name}!`;
    const greetAlice = partial(greet, "Alice");
    assert.equal(greetAlice(), "Hello, Alice!");
  });

  it("should work with mixed types", () => {
    const concat = (a: string, b: number, c: boolean) => `${a}-${b}-${c}`;
    const partialConcat = partial(concat, "foo");
    assert.equal(partialConcat(42, true), "foo-42-true");
  });

  it("should allow multiple calls with different later arguments", () => {
    const sub = (a: number, b: number) => a - b;
    const sub10 = partial(sub, 10);
    assert.equal(sub10(3), 7);
    assert.equal(sub10(8), 2);
  });
});
