// e2e/recoveringFromBrowserCrash/automatedBrowserRecovery.ts
// quoted from https://markaicode.com/playwright-mcp-browser-crash-recovery-patterns-2025/
import * as PW from from '@playwright/test';
import playwright from 'playwright';

// Automated Browser Recovery pattern
export class PlaywrightRecoveryManager {

    browser: PW.Browser | null;
    contexts: Map<PW.Browser, PW.Page>;
    retryAttempts: number;
    retryDelay: number;

    constructor() {
        this.browser  = null;
        this.contexts = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async initialize() {
        try {
            this.browser = await playwright.chromium.launch({
                headless: true
            });
        } catch (error) {
            console.error('Failed to launch browser:', error);
            throw error;
        }
    }

    async executeWithRecovery(pageOperation) {
        let attempts = 0;

        while (attempts < this.retryAttempts) {
            try {
                if (!this.browser || !this.browser.isConnected()) {
                    await this.initialize();
                }

                const context = await this.browser.newContext();
                const page = await context.newPage();

                // Execute the operation
                const result = await pageOperation(page);

                await page.close();
                await context.close();

                return result;
            } catch (error: any) {
                attempts++;

                if (error.message.includes('browser has been closed') ||
                    error.message.includes('target closed') ||
                    error.message.includes('connection closed')) {
                    console.log(`Browser crash detected, recovery attempt ${attempts}`);
                    await this.initialize();
                } else {
                    throw error;
                }

                await new Promise(r => setTimeout(r, this.retryDelay));
            }
        }

        throw new Error('Recovery failed after maximum retry attempts');
    }
}

