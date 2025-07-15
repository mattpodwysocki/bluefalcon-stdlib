import { describe, it, assert } from "vitest";
import { throttle } from "../../src/functions/throttle.js";

describe("throttle", () => {
  it("should call the function immediately on first call", () => {
    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 50);
    fn();
    assert.equal(callCount, 1);
  });

  it("should not call the function again within the wait period", () => {
    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 50);
    fn();
    fn();
    fn();
    assert.equal(callCount, 1);
  });

  it("should call the function again after the wait period", async () => {
    let callCount = 0;
    const fn = throttle(() => { callCount++; }, 30);
    fn();
    await new Promise((resolve) => setTimeout(resolve, 40));
    fn();
    assert.equal(callCount, 2);
  });

  it("should use the last arguments provided during the wait period", async () => {
    let result: number | undefined;
    const fn = throttle((x: number) => { result = x; }, 30);
    fn(1);
    fn(2);
    fn(3);
    await new Promise((resolve) => setTimeout(resolve, 40));
    assert.equal(result, 3);
  });

  it("should throttle multiple calls and call with latest args after wait", async () => {
    const results: number[] = [];
    const fn = throttle((x: number) => { results.push(x); }, 20);
    fn(1);
    fn(2);
    setTimeout(() => fn(3), 10);
    setTimeout(() => fn(4), 15);

    await new Promise((resolve) => setTimeout(resolve, 80));
    // Should call with 1 immediately, and then with 4 after wait
    assert.deepEqual(results, [1, 4]);
  });
});
