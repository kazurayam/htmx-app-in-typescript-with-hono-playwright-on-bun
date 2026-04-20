// e2e/section10.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section10', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section10', { timeout: 10000 })
    });

    it("click button with hx-swap=innerHTML", async () => {
        const button = page.locator('css=button[hx-target="#inner-target"][hx-swap="innerHTML"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await page.waitForTimeout(500)
        const p = page.locator('css=p#inner-target')
        expect(await p.innerHTML()).toMatch(/[0-9]/)
        const p2 = page.locator('css=p#inner-target > p')
        expect(await p2.innerHTML()).toMatch(/[0-9]/)
    })

    afterAll(async () => {
        await browser.close();
    });
});
