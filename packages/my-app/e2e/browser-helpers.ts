// e2e/browser-helpers.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

/**
 * https://www.technetexperts.com/slow-playwright-new-page-fix/
 */
export const launchChromium = async (): Promise<Browser> => {
    let browser = await chromium.launch(
        {
            headless: true,
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
            timeout: 20_000
         });
    return browser;
};

export const newContext = async (browser: Browser): Promise<BrowserContext> => {
    let context = await browser.newContext({
        javaScriptEnabled: true
    });
    context.removeAllListeners();

    // some custom settings
    context.setDefaultNavigationTimeout(20_000);
    context.tracing.start({ screenshots: true, snapshots: true })
    return context;
};

export const newPage = async (context: BrowserContext): Promise<Page> => {
    let page = await context.newPage();
    return page;
}
