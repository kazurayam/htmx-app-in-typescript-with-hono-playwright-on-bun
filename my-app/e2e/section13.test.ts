// e2e/section13.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section13', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section13')
    });

    it("ダイアログ", async () => {
        page.on('dialog', async (dialog) => {
            await page.waitForTimeout(100)
            expect(dialog.message()).toMatch(/ハロー/)
            dialog.accept()
        });
        const button = page.locator('css=button[hx-confirm="ハロー"]')
        await button.click()
    })

    afterAll(async () => {
        await browser.close();
    });
});
