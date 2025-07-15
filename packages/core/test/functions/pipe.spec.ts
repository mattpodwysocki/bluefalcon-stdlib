import { describe, it, assert } from "vitest";
import { pipe, compose } from "../../src/functions/pipe.js";

describe("pipe", () => {
  it("should pipe value through functions left to right", () => {
    const double = (x: number) => x * 2;
    const increment = (x: number) => x + 1;
    const square = (x: number) => x * x;

    const result = pipe(2, double, increment, square); // ((2 * 2) + 1)^2 = 25
    assert.equal(result, 25);
  });

  it("should return the value if no functions are provided", () => {
    assert.equal(pipe(42), 42);
    assert.equal(pipe("test"), "test");
  });

  it("should work with different types", () => {
    const toStr = (n: number) => n.toString();
    const append = (s: string) => s + "!";
    assert.equal(pipe(5, toStr, append), "5!");
  });
});

describe("compose", () => {
  it("should compose functions right to left", () => {
    const double = (x: number) => x * 2;
    const increment = (x: number) => x + 1;
    const square = (x: number) => x * x;

    const composed = compose(square, increment, double); // square(increment(double(x)))
    assert.equal(composed(2), 25);
  });

  it("should return the value if no functions are provided", () => {
    const id = compose();
    assert.equal(id(42), 42);
    assert.equal(id("test"), "test");
  });

  it("should work with different types", () => {
    const toStr = (n: number) => n.toString();
    const append = (s: string) => s + "!";
    const composed = compose(append, toStr);
    assert.equal(composed(5), "5!");
  });
});
