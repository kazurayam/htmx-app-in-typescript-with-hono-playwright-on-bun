// e2e/section5.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section5', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section5', { timeout: 10000 })
    });

    it("<button hx-get=/yahoo hx-target=#target1 hx-trigger=click[true]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[true]"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(500)
        const p = page.locator('css=p#target1');
        expect(await p.innerText()).toMatch(/やっほー!/);
    });

    it("<button hx-get=/yahoo hx-target=#target2 hx-trigger=click[false]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[false]"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(500)
        const p = page.locator('css=p#target2');
        expect(await p.innerText()).toMatch(/foo/);
    });

    it("<button hx-get=/yahoo hx-target=#target3 hx-trigger=click[shiftKey]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey]"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click({ modifiers: ['Shift'] });   // Shift + Click
        await page.waitForTimeout(500);
        const p = page.locator('css=p#target3');
        expect(await p.innerText()).toMatch(/やっほー!/)
    });

    it("<button hx-get=/yahoo hx-target=#target4 hx-trigger=click[checkGlobalState()]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[checkGlobalState()]"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(500);
        const p = page.locator('css=p#target4');
        expect(await p.innerText()).toMatch(/やっほー!/);
    });

    it("<button hx-get=/yahoo hx-target=#target5 hx-trigger=click[shiftKey&&altKey]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey&&altKey]"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click({ modifiers: ['Shift', 'Alt'] });   // Shift + Alt + Click
        await page.waitForTimeout(500)
        const p = page.locator('css=p#target5');
        expect(await p.innerText()).toMatch(/やっほー!/)
    });

    afterAll(async () => {
        await browser.close();
    });
})
