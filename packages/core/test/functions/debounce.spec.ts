import { describe, it, assert } from "vitest";
import { debounce } from "../../src/functions/debounce.js";

describe("debounce", () => {
  it("should only call the function once after the wait period", async () => {
    let callCount = 0;
    const fn = debounce(() => { callCount++; }, 50);

    fn();
    fn();
    fn();

    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(callCount, 1);
  });

  it("should use the last arguments provided", async () => {
    let result: number | undefined;
    const fn = debounce((x: number) => { result = x; }, 30);

    fn(1);
    fn(2);
    fn(3);

    await new Promise((resolve) => setTimeout(resolve, 60));
    assert.equal(result, 3);
  });

  it("should reset the timer if called again before wait", async () => {
    let callCount = 0;
    const fn = debounce(() => { callCount++; }, 40);

    fn();
    setTimeout(fn, 20);
    setTimeout(fn, 30);

    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(callCount, 1);
  });
});
