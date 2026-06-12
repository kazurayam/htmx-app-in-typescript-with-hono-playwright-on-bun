// test/promise-utils.test.ts

import { describe, test, expect } from 'bun:test';
import { getLogger } from '@logtape/logtape';
import { PromiseUtils } from '../src/promise-utils';

const logger = getLogger(["my-app", "PromiseUtils.test"]);

describe("🏗️ Generic Promise Utilities", () => {
    test("Promise with timeout", async () => {
        const slowPromise = new Promise<string>((resolve => {
            setTimeout(() => {
                resolve("I'm slow! 🐌");
            }, 5000);
        }));
        try {
            const result = await PromiseUtils.withTimeout(slowPromise, 2000);
            logger.info(result);
        } catch (error) {
            logger.error(`💥 Timeout caught: ${error.message}`);
        }
    })
    test("🔄 Retry unreliable operation", async () => {
        const unreliableOperation = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                if (Math.random() > 0.7) {
                    resolve("Success!  🎉");
                } else {
                    reject(new Error("Random failure 😞"));
                }
            })
        }
        try {
            const result = await PromiseUtils.retry(unreliableOperation, 5, 500);
            logger.info(`🎯 Final result: ${result}`);
        } catch (error) {
            logger.info(`💥 All retries failed:", ${error.message}`);
        }
    });
})
