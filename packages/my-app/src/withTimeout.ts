// e2e/withTimeout.ts
// Original: https://nobuti.com/thoughts/resilience-patterns-timeouts

/**
 * Custom error class for timeout-related exceptions
 * @extends Error
 */
export class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
        this.message = "Operation timed out";
        Object.setPrototypeOf(this, TimeoutError.prototype)
    }

    /**
     * Checks if an error is a TimeoutError
     */
    static isTimeoutError(error: unknown): error is TimeoutError {
        return error instanceof TimeoutError;
    }
}

/**
 * Configuration options for timeout behavior
 */
interface TimeoutOptions {
    /** Timeout duration in milliseconds */
    timeoutMs: number;
    /** Whether the opration supports abortion */
    abortable?: boolean;
    /** Operational callback to execute on Timeout */
    onTimeout?: () => void;
}

/**
 * Wraps a promise with a timeout mechanism
 * @template T - Type type of the promise result
 * @param promise - The promise to wrap
 * @param options - Timeout configuration options
 * @return A promise that will reject if the timeout is exceeded
 * @throws {TimeoutError} When the operation times out
 *
 * @example
 * // Basic usage
 * const result = await withTimeout(
 *   fetch('https://api.example.com/data'),
 *   { timeoutMs: 5000 }
 * );
 *
 * // With abort signal
 * const result = await withTimeout(
 *   fetch('https://api.example.com/data'),
 *   { timeoutMs: 5000, abortable: true}
 * );
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    options: TimeoutOptions
): Promise<T> {
    const { timeoutMs, abortable = false, onTimeout } = options;

    if (timeoutMs <= 0) {
        throw new Error("Timeout must be greater than 0");
    }

    if (abortable) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            onTimeout?.();
        }, timeoutMs);

        try {
            const result = await promise;
            clearTimeout(timeoutId);
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new TimeoutError(`${error}`);
            }
            throw error;
        }
    }

    return Promise.race([
        promise,
        new Promise<never>((_, reject) => {
            const timeoutId = setTimeout(() => {
                onTimeout?.();
                reject(new TimeoutError(`Timeout of ${timeoutMs} exceeded`))
            }, timeoutMs);
        }),
    ]);
}

