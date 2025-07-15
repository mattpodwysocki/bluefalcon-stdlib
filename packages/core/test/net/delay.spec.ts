import { describe, it, assert, expect } from "vitest";
import { delay } from "../../src/net/delay.js";

describe("delay", () => {
  it("resolves after the specified time", async () => {
    const start = Date.now();
    await delay(50);
    const elapsed = Date.now() - start;
    assert.isAtLeast(elapsed, 45); // allow some timer slop
  });

  it("resolves even with options omitted", async () => {
    await expect(delay(10)).resolves.toBeUndefined();
  });

  it("rejects with AbortError if aborted before delay", async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);
    await expect(() => delay(100, { abortSignal: controller.signal })).rejects.toThrow("The delay was aborted.");
  });

  it("rejects with custom abort message if provided", async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10);
    await expect(
      () => delay(100, { abortSignal: controller.signal, abortErrorMsg: "custom" }),
    ).rejects.toThrow("custom");
  });

  it("does not reject if already resolved before abort", async () => {
    const controller = new AbortController();
    await delay(10, { abortSignal: controller.signal });
    controller.abort();
    // No error should be thrown
  });
});
