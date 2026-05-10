// e2e/section7.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section7', async () => {
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await PW.chromium.launch();
    })
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section7')
        await page.waitForLoadState('load', { timeout: 10_000 });
    });

    it("hx-trigger=load delay:3s", async () => {
        const p = page.locator('css=p[hx-trigger="load delay:3s"]');
        await PW.expect(p).toContainText(/foo/);
        await page.waitForTimeout(3500);
        await PW.expect(p).toContainText(/[0-9]+/);
    })

    it("hx-trigger=revealed delay:1s", async () => {
        const p_as_target = page.locator('css=p#target1');
        await PW.expect(p_as_target).toContainText(/foo/);
        const p_as_trigger = page.locator('css=p[hx-trigger="revealed delay:1s"]');
        // scroll to the element
        await p_as_trigger.scrollIntoViewIfNeeded();
        // will show a digit after delay:1s
        await page.waitForTimeout(1500);
        await PW.expect(p_as_target).toContainText(/[0-9]+/);
    })

    /*
     * tests for ht-trigger="interset" are omitted as are cumbersome
     */

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        await browser.close();
    });
});
