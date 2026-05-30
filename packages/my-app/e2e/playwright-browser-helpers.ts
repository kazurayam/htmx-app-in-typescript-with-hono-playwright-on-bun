// e2e/browser-helpers.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { waitUntil, TimeoutError } from 'async-wait-until';

/**
 * https://www.technetexperts.com/slow-playwright-new-page-fix/
 */
export const launchChromium = async (): Promise<Browser> => {
    const browser = await chromium.launch(
        {
            args: [
                // Recommended optimization arguments for enterprise network environments
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // Crucial for bypassing network checks/proxy auto-detection delays
                '--no-proxy-server',
                '--proxy-bypass-list=*',
                // Prevents slow DNS fallbacks or resolving internal domain lookups
                '--disable-features=NetworkService',
                '--disable-dev-shm-usage',
            ],
            headless: true,
            timeout: 20_000,
         });
    return browser;
};

export const newContext = async (browser: Browser): Promise<BrowserContext> => {
    const context = await browser.newContext({
        javaScriptEnabled: true
    });
    context.removeAllListeners();

    // some custom settings
    context.setDefaultNavigationTimeout(20_000);
    return context;
};

/*
export const newPage = async (context: BrowserContext) : Promise<Page> => {
    return await context.newPage();
}
    */
export const newPage = async (context: BrowserContext): Promise<Page> => {
    const p = new Promise((resolve, reject) => {
        (async () => {
            try {
                const pg = await context.newPage();
                resolve(pg);
            } catch (error) {
                reject(null);
            }
        })()
    });
    try {
        const page = await waitUntil(async () => {
            await p;
        }, { timeout: 5_000, intervalBetweenAttempts: 1_000 });
        resolve(page);
    } catch (error) {
        rejects(error);
    }
}

