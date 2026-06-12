// e2e/browser-helpers.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { withTimeout, TimeoutError } from '../src/withTimeout';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "browser-helpers"]);

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
    // some custom settings
    const context = await browser.newContext({ javaScriptEnabled: true });
    context.removeAllListeners();
    context.setDefaultNavigationTimeout(20_000);

    return context;
};

/*
export const newPage = async (context: BrowserContext) : Promise<Page> => {
    return await context.newPage();
}
*/

export const newPage = async (context: BrowserContext): Promise<Page> => {
    if (context === null) {
        throw new Error('invalid argument. context is null');
    }
    try {
        const page = await withTimeout(
            context.newPage(),
            {
                timeoutMs: 10_000,
                abortable: false,
                onTimeout: () => {
                    logger.info('context.newPage() timeout!');
                }
            });
        return page;
    } catch (error) {
        if (TimeoutError.isTimeoutError(error)) {
            logger.error("TimeoutError occured");
            const browser = context.browser();
            if (browser !== null) {
                const nctx: BrowserContext = await newContext(browser);
                return await newPage(nctx);
            }
        }
        throw error;
    }
}
