// e2e/withTimeout.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { TimeoutError, withTimeout } from './withTimeout';

// here I assume that a server is up and running at http://localhost:3001/heavy

describe("test withTimeout function", async () => {
    it("fetch http://localhost:3001/heavy with timeout", async () => {
        async function fetchHeavyStuff = () => {
            try {
                const response = await withTimeout(fetch('http://localhost:3001/heavy'), {
                    timeoutMs: 6_000,
                    abortable: true,
                    onTimeout: () => {
                        // Log timeout event to monitoring system
                        console.log(`fetch timeout`);
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
        const res = fetchHeavyStuff();
        console.log(res)   // would print "<span style='color:#ff0000;'>ロード完了!</span>"
    }, 15_000)
})

const fallbackData = () => {
    return "Timed out";
}
