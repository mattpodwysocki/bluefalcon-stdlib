
import { AbortError, AbortOptions } from "../concurrency/abort.js";
import { getRandomIntegerInclusive } from "../crypto/random.js";

const StandardAbortMessage = "The delay was aborted.";

/**
 * A wrapper for setTimeout that resolves a promise after timeInMs milliseconds.
 * @param timeInMs - The number of milliseconds to be delayed.
 * @param options - The options for delay - currently abort options
 * @returns Promise that is resolved after timeInMs
 */
export function delay(timeInMs: number, options?: AbortOptions): Promise<void> {
  let token: ReturnType<typeof setTimeout>;
  const { abortSignal, abortErrorMsg } = options ?? {};

  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(token);
      reject(new AbortError(abortErrorMsg ?? StandardAbortMessage));
    };

    token = setTimeout(() => {
      abortSignal?.removeEventListener("abort", onAbort);
      resolve();
    }, timeInMs);

    abortSignal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Configuration for exponential backoff retry logic.
 */
export interface RetryConfig {
  /**
   * The maximum number of retry attempts.
   */
  maxAttempts: number;
  /**
   * The initial delay between retry attempts.
   */
  retryDelayInMs: number;
  /**
   * The maximum delay between retry attempts.
   */
  maxRetryDelayInMs: number;
  /**
   * The amount of jitter to add to the delay (0.5 = 50% jitter).
   */
  jitter?: number;
  /**
   * An optional abort signal to cancel the retries.
   */
  abortSignal?: AbortSignal;
}

/**
 * Calculates the delay interval for retry attempts using exponential delay with jitter.
 * @param retryAttempt - The current retry attempt number.
 * @param config - The exponential retry configuration.
 * @returns An object containing the calculated retry delay.
 */
export function calculateRetryDelay(
  retryAttempt: number,
  config: RetryConfig,
): { retryAfterInMs: number } {
  const exponentialDelay = config.retryDelayInMs * Math.pow(2, retryAttempt);
  const clampedDelay = Math.min(config.maxRetryDelayInMs, exponentialDelay);

  const jitter = config.jitter ?? 0.5;
  const jitterRange = clampedDelay * jitter;
  const retryAfterInMs = clampedDelay - jitterRange + getRandomIntegerInclusive(0, jitterRange);

  return { retryAfterInMs };
}
