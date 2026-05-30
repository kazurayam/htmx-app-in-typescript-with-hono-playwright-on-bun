// e2e/withTimeout.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { withTimeout, TimeoutError } from '../src/withTimeout';

// here I assume that a server is up and running at http://localhost:3001/heavy
describe("test withTimeout function", async () => {
    it("fetch http://localhost:3001/heavy with timeout shorter than 5 seconds", async () => {
        // The URL '/heavy' will take 5 seconds to respond
        const res = fetchResource('http://localhost:3001/heavy', 4_000);
        console.log(await res)   // would print "<span style='color:#ff0000;'>ロード完了!</span>"
    }, 15_000)
    it("fetch http://localhost:3001/heavy with timeout longer than 5 seconds", async () => {
        // The URL '/heavy' will take 5 seconds to respond
        const res = fetchResource('http://localhost:3001/heavy', 6_000);
        console.log(await res)   // would print "<span style='color:#ff0000;'>ロード完了!</span>"
    }, 15_000)
})

const fetchResource = async (url: string, timeoutMs: number) => {
    try {
        const response = await withTimeout(
            fetch(url),
            {
                timeoutMs: timeoutMs,
                abortable: false,
                onTimeout: () => {
                    // Log timeout event to monitoring system
                    console.log('fetch timeout!');
                }
            });
        return await response.text();
    } catch (error) {
        if (TimeoutError.isTimeoutError(error)) {
            // Handle timeout specifically
            return fallbackData();
        }
        throw error;
    }
}

const fallbackData = () => {
    return "data as fall back";
}
