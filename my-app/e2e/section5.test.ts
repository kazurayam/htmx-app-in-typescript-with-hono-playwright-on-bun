// e2e/section5.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section5', async () => {
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await PW.chromium.launch();
    });
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section5')
        await page.waitForLoadState('load', { timeout: 10_000 });
    });

    it("<button hx-get=/yahoo hx-target=#target1 hx-trigger=click[true]>", async () => {
        const button: PW.Locator = page.locator('css=button[hx-trigger="click[true]"]');
        await PW.expect(button).toBeVisible();
        const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(page.locator('css=p#target1')).toContainText(/やっほー!/);
    });

    it("<button hx-get=/yahoo hx-target=#target2 hx-trigger=click[false]>", async () => {
        const button: PW.Locator = page.locator('css=button[hx-trigger="click[false]"]');
        await PW.expect(button).toBeVisible();
        // Because of hx-trigger="click[false]", clicking the button will trigger no request will be sent.
        // Therefore I should NOT wait for response here
        //const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        //await responsePromise;
        const p = page.locator('css=p#target2');
        await PW.expect(p).not.toContainText(/やっほー!/);
        await PW.expect(p).toContainText(/foo/);
    });

    it("<button hx-get=/yahoo hx-target=#target3 hx-trigger=click[shiftKey]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey]"]');
        await PW.expect(button).toBeVisible();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click({ modifiers: ['Shift'] });   // Shift + Click
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(page.locator('css=p#target3')).toContainText(/やっほー!/)
    });

    it("<button hx-get=/yahoo hx-target=#target4 hx-trigger=click[checkGlobalState()]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[checkGlobalState()]"]');
        await PW.expect(button).toBeVisible();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(page.locator('css=p#target4')).toContainText(/やっほー!/);
    });

    it("<button hx-get=/yahoo hx-target=#target5 hx-trigger=click[shiftKey&&altKey]>", async () => {
        const button = page.locator('css=button[hx-trigger="click[shiftKey&&altKey]"]');
        await PW.expect(button).toBeVisible();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click({ modifiers: ['Shift', 'Alt'] });   // Shift + Alt + Click
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(page.locator('css=p#target5')).toContainText(/やっほー!/)
    });

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        await browser.close();
    })
})
