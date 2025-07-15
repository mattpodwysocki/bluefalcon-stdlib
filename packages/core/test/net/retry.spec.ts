import { describe, it, expect } from "vitest";
import {
  fixedStrategy,
  exponentialStrategy,
  linearStrategy,
  fibonacciStrategy,
  decorrelatedJitterStrategy,
} from "../../src/net/retry.js";
import { calculateRetryDelay } from "../../src/net/delay.js";

const baseConfig = {
  maxAttempts: 10,
  retryDelayInMs: 100,
  maxRetryDelayInMs: 1000,
  jitter: 0,
};

describe("retry strategies", () => {
  it("fixedStrategy returns the fixed delay", () => {
    for (let i = 0; i < 5; i++) {
      expect(fixedStrategy(i, baseConfig)).toBe(100);
    }
  });

  it("exponentialStrategy returns exponential backoff delay", () => {
    for (let i = 0; i < 5; i++) {
      const expected = calculateRetryDelay(i, baseConfig).retryAfterInMs;
      expect(exponentialStrategy(i, baseConfig)).toBe(expected);
    }
  });

  it("linearStrategy returns linear backoff delay", () => {
    expect(linearStrategy(0, baseConfig)).toBe(100);
    expect(linearStrategy(1, baseConfig)).toBe(200);
    expect(linearStrategy(2, baseConfig)).toBe(300);
    expect(linearStrategy(10, baseConfig)).toBe(1000); // capped at maxRetryDelayInMs
  });

  it("fibonacciStrategy returns fibonacci backoff delay", () => {
    // Fibonacci sequence: 1, 1, 2, 3, 5, 8, ...
    expect(fibonacciStrategy(0, baseConfig)).toBe(100); // 1*100
    expect(fibonacciStrategy(1, baseConfig)).toBe(100); // 1*100
    expect(fibonacciStrategy(2, baseConfig)).toBe(200); // 2*100
    expect(fibonacciStrategy(3, baseConfig)).toBe(300); // 3*100
    expect(fibonacciStrategy(4, baseConfig)).toBe(500); // 5*100
    expect(fibonacciStrategy(10, baseConfig)).toBe(1000); // capped at maxRetryDelayInMs
  });

  it("decorrelatedJitterStrategy returns a value within expected range", () => {
    // The first call always returns retryDelayInMs
    expect(decorrelatedJitterStrategy(0, baseConfig)).toBe(100);
    // Subsequent calls should be between retryDelayInMs and maxRetryDelayInMs
    for (let i = 1; i < 10; i++) {
      const val = decorrelatedJitterStrategy(i, baseConfig);
      expect(val).toBeGreaterThanOrEqual(100);
      expect(val).toBeLessThanOrEqual(1000);
    }
  });
});
