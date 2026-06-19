// e2e/browser-helpers.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { withTimeout, TimeoutError } from './withTimeout';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "browser-helpers"]);

export const openChromium = async (): Promise<{ browser: Browser, context: BrowserContext }> => {
    const browser = await launchChromium();
    const context = await newContext(browser);
    return { browser, context };
}

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
            timeout: 10_000,
         });
    return browser;
};

export const newContext = async (browser: Browser): Promise<BrowserContext> => {
    if (browser === null) {
        throw new Error('invalid argument. browser is null')
    }
    const context = await browser.newContext({
        javaScriptEnabled: true,
        viewport: { width: 700, height: 800 }
    });
    // some custom settings
    context.removeAllListeners();
    context.setDefaultNavigationTimeout(20_000);
    return context;
};


export const newPage = async (context: BrowserContext) : Promise<Page> => {
    return await context.newPage();
}
