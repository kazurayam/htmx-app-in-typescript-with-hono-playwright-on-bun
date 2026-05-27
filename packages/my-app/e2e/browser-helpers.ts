// e2e/browser-helpers.ts
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export const launchChromium = async (): Promise<Browser> => {
    let browser = await chromium.launch({ headless: true });
    return browser;
};

export const newContext = async (browser: Browser): Promise<BrowserContext> => {
    let context = await browser.newContext()
    context.setDefaultNavigationTimeout(20_000);
    context.tracing.start({ screenshots: true, snapshots: true })
    return context;
};

export const newPage = async (context: BrowserContext): Promise<Page> => {
    let page = await context.newPage();
    return page;
}
