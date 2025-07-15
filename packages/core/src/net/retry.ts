/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateRetryDelay, delay } from "./delay.js";
import type { RetryConfig } from "./delay.js";
import { getRandomIntegerInclusive } from "../crypto/random.js";

/**
 * A strategy function receives the attempt number and config,
 * and returns the delay in ms before the next retry.
 * Return undefined or a negative value to stop retrying.
 */
export type RetryStrategy = (
  attempt: number,
  config: RetryConfig,
  error?: unknown,
) => number | undefined;

/**
 * Fixed delay strategy.
 * @param _attempt - The current retry attempt number.
 * @param config - The retry configuration.
 * @returns The fixed delay in ms.
 */
export const fixedStrategy: RetryStrategy = (_attempt, config) => config.retryDelayInMs;

/**
 * Exponential backoff strategy.
 * @param attempt - The current retry attempt number.
 * @param config - The retry configuration.
 * @returns The exponential backoff delay in ms.
 */
export const exponentialStrategy: RetryStrategy = (attempt, config) =>
  calculateRetryDelay(attempt, config).retryAfterInMs;

/**
 * Linear backoff strategy.
 * @param attempt - The current retry attempt number.
 * @param config - The retry configuration.
 * @returns The linear backoff delay in ms.
 */
export const linearStrategy: RetryStrategy = (attempt, config) =>
  Math.min(config.maxRetryDelayInMs, config.retryDelayInMs * (attempt + 1));

/**
 * Fibonacci backoff strategy.
 * @returns A function that calculates the Fibonacci delay based on the attempt number.
 */
export const fibonacciStrategy: RetryStrategy = (() => {
  const fibs = [0, 1];
  return (attempt, config) => {
    while (fibs.length <= attempt + 1) {
      fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
    }
    return Math.min(config.maxRetryDelayInMs, config.retryDelayInMs * fibs[attempt + 1]);
  };
})();

/**
 * Decorrelated jitter strategy.
 * This strategy uses a random delay that is decorrelated from the previous delay.
 * It starts with the initial retry delay and increases it by a random factor.
 * @returns A function that calculates the decorrelated jitter delay based on the attempt number.
 */
export const decorrelatedJitterStrategy: RetryStrategy = (() => {
  let sleep: number;
  return (attempt, config) => {
    if (attempt === 0) {
      sleep = config.retryDelayInMs;
      return sleep;
    }
    sleep = Math.min(
      config.maxRetryDelayInMs,
      getRandomIntegerInclusive(config.retryDelayInMs, sleep * 3),
    );
    return sleep;
  };
})();

/**
 * Function to determine if a retry should be attempted based on the error,
 * the current attempt number, and the retry configuration.
 * Returns true to retry, false to stop retrying.
 */
export type ShouldRetry = (error: unknown, attempt: number, config: RetryConfig) => boolean;

/**
 * Retry a function with a configurable strategy.
 * @param fn - The function to retry.
 * @param config - The retry configuration.
 * @param strategy - The retry strategy.
 * @param shouldRetry - A function to determine if a retry should be attempted.
 * @returns The result of the function or throws an error if all retries fail.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  strategy: RetryStrategy,
  shouldRetry?: ShouldRetry,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (
        attempt < config.maxAttempts - 1 &&
        (shouldRetry == null || shouldRetry(err, attempt, config))
      ) {
        const wait = strategy(attempt, config, err);
        if (wait == null || wait < 0) break;
        await delay(wait, { abortSignal: config.abortSignal });
      } else {
        break;
      }
    }
  }
  throw lastError;
}

/**
 * HTTP Retry-After strategy.
 * @param attempt - The current retry attempt number.
 * @param config - The retry configuration.
 * @param error - The error that caused the retry.
 * @returns The delay in ms before the next retry.
 */
export const httpRetryAfterStrategy: RetryStrategy = (attempt, config, error) => {
  // Check for Retry-After header (works for fetch, Axios, etc.)
  let retryAfter: number | undefined;
  if (error && typeof error === "object") {
    // Try to get headers from error.response or error
    const response = (error as any).response ?? error;
    const headers =
      response.headers && typeof response.headers.get === "function"
        ? response.headers // fetch Response
        : response.headers && typeof response.headers === "object"
          ? {
              get: (name: string) => response.headers[name] ?? response.headers[name.toLowerCase()],
            }
          : undefined;

    if (headers) {
      const value = headers.get("retry-after");
      if (value) {
        // Retry-After can be seconds or HTTP-date
        const seconds = Number(value);
        if (!isNaN(seconds)) {
          retryAfter = seconds * 1000;
        } else {
          const date = Date.parse(value);
          if (!isNaN(date)) {
            retryAfter = date - Date.now();
          }
        }
      }
    }
  }

  if (retryAfter != null && retryAfter > 0) {
    return retryAfter;
  }
  // Fallback to exponential or other strategy
  return calculateRetryDelay(attempt, config).retryAfterInMs;
};

// Example: HTTP shouldRetry
export const httpShouldRetry: ShouldRetry = (error) => {
  if (typeof error === "object" && error !== null) {
    // Axios/Fetch: error.response?.status or error.status
    const status = (error as any).status ?? (error as any).response?.status;
    if (typeof status === "number") {
      // Retry on 5xx, 429, and network errors (no status)
      return status >= 500 || status === 429;
    }
  }
  // Retry on network errors (no status)
  return true;
};

// Example: Network error shouldRetry
export const networkErrorShouldRetry: ShouldRetry = (error) => {
  if (typeof error === "object" && error !== null) {
    const code = (error as any).code || (error as any).errno || (error as any).errorCode;
    if (typeof code === "string") {
      const retryableCodes = [
        "ETIMEDOUT",
        "ESOCKETTIMEDOUT",
        "ECONNREFUSED",
        "ECONNRESET",
        "EAI_AGAIN",
        "ENETDOWN",
        "ENETRESET",
        "ENETUNREACH",
        "EHOSTDOWN",
        "EHOSTUNREACH",
        "EPIPE",
        "EAGAIN",
        "EADDRINUSE",
        "EADDRNOTAVAIL",
        "ENOTFOUND",
      ];
      return retryableCodes.includes(code);
    }
  }
  // Optionally, retry on network errors with no code
  return false;
};
