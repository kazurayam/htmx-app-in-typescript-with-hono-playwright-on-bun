// e2e/guardedCallback.ts
import { Page, Browser, chromium } from '@playwright/test';

export async function guardedCallback(callback: () => Promise<void>, page: Page, browser: Browser, url: string) {
    try {
        await callback();
    } catch (error) {
        console.error('Error in click or waiting for response:', error);
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto(url);
        await page.waitForLoadState('load', { timeout: 20_000 });
        throw error;
    }
}

