// e2e/section5.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import * as BH from './browser-helpers';

describe('test http://localhost:3001/section5', async () => {
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await BH.launchChromium();
        context = await BH.newContext(browser);
        await context.tracing.start({ screenshots: true, snapshots: true })
    });
    beforeEach(async () => {
        page = await BH.newPage(context);
        await page.goto('http://localhost:3001/section5', { timeout: 20_000})
        await page.waitForLoadState('load', { timeout: 20_000 });
    }, 20_000);

    it("click[true]>", async () => {
        const button: PW.Locator = page.locator('css=button[hx-trigger="click[true]"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/yahoo/, { timeout: 20000 });
            await button.click();
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        await PW.expect(page.locator('css=p#target1')).toContainText(/やっほー!/);
    });

    it("click[false]", async () => {
        const button: PW.Locator = page.locator('css=button[hx-trigger="click[false]"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        // Because of hx-trigger="click[false]", clicking the button will trigger no request will be sent.
        // Therefore I should NOT wait for response here
        //const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 20000 });
        await button.click();
        //await responsePromise;
        const p = page.locator('css=p#target2');
        await PW.expect(p).not.toContainText(/やっほー!/);
        await PW.expect(p).toContainText(/foo/);
    });

    it("click[shiftKey]", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey]"]');
        await button.waitFor({ state: 'visible', timeout: 20000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 20000 });
            await button.click({ modifiers: ['Shift'] });   // Shift + Click
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        await PW.expect(page.locator('css=p#target3')).toContainText(/やっほー!/)
    });

    it("click[checkGlobalState()]", async () => {
        const button = page.locator('css=button[hx-trigger="click[checkGlobalState()]"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 20000 });
            await button.click();
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        await PW.expect(page.locator('css=p#target4')).toContainText(/やっほー!/);
    });

    it("click[shiftKey&&altKey]", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey&&altKey]"]');
        await button.waitFor({ state: 'visible', timeout: 20000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 20000 });
            await button.click({ modifiers: ['Shift', 'Alt'] });   // Shift + Alt + Click
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        await PW.expect(page.locator('css=p#target5')).toContainText(/やっほー!/)
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section5.zip` });
            await browser.close();
        }
    })
})
