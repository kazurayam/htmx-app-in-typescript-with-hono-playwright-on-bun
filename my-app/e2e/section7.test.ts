// e2e/section7.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section7', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section7', { timeout: 10000 })
    });

    it("hx-trigger=load delay:3s", async () => {
        const p = page.locator('css=p[hx-trigger="load delay:3s"]');
        expect(await p.innerText()).toMatch(/foo/);
        await page.waitForTimeout(4000);
        expect(await p.innerText()).toMatch(/[0-9]+/);
    })

    it("hx-trigger=revealed delay:1s", async () => {
        const p_as_target = page.locator('css=p#target1');
        expect(await p_as_target.innerText()).toMatch(/foo/);
        const p_as_trigger = page.locator('css=p[hx-trigger="revealed delay:1s"]');
        // scroll to the element
        await p_as_trigger.scrollIntoViewIfNeeded();
        // will show a digit after delay:1s
        await page.waitForTimeout(2000);
        expect(await p_as_target.innerText()).toMatch(/[0-9]+/);
    })

    /*
     * tests for ht-trigger="interset" are omitted as are cumbersome
     */

    afterAll(async () => {
        await browser.close();
    });
});
