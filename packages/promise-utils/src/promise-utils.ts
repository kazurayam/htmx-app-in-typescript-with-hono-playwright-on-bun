// src/promise-utils.ts
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "PromiseUtils"]);

// 🛠️ Generic utility functions
export class PromiseUtils {

    // ⏰ Add timeout to any Promise
    static withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error(`⏰ Promise timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });
        return Promise.race([promise, timeoutPromise]);
    }

    // 🔄 Retry Promise with exponential backoff
    static async retry<T>(
        promiseFactory: () => Promise<T>,
        maxAttempts: number = 3,
        baseDelay: number = 1000
    ): Promise<T> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const result = await promiseFactory();
                logger.info(`✅ Success on attempt ${attempt}`);
                return result;
            } catch (error) {
                if (attempt === maxAttempts) {
                    logger.error(`💥 Failed after ${maxAttempts} attempts`);
                    throw error;
                }
                const delay = baseDelay * Math.pow(2, attempt - 1);
                logger.info(`🔄 Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error("This should never happen"); // 🛡️ TypeScript safety
    }
}
