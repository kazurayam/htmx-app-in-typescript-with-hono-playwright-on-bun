// tests/section5.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section5.test"]);
const url = 'http://localhost:3001/section5';

describe(`test ${url}`, async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let driver: BrowserDriverChromium;
    let page: PW.Page;
    beforeAll(async () => {
        driver = await BrowserDriverChromium.create('section5');
    });
    beforeEach(async () => {
        page = await driver.navigateToUrl(url);
    }, 20_000);

    /*
    test("click[true]>", async () => {
        try {
            page = await BH.newPage(context);
            await page.goto(url, { timeout: 15_000 });
            await page.waitForLoadState('load', { timeout: 10_000 });
        } catch (error) {
            logger.error(`in the beforeEach, timeout occured: ${error}`);
            // when a TimeoutError occurs, restart the browser and retry
            browser.close();
            browser = await BH.launchChromium();
            context = await BH.newContext(browser)
            await context.tracing.start({ screenshots: true, snapshots: true })
            //
            page = await BH.newPage(context);
            await page.goto(url, { timeout: 15_000 });
            await page.waitForLoadState('load', { timeout: 10_000 });
        }
    });
    */

    test("click[false]", async () => {
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

    test("click[shiftKey]", async () => {
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

    test("click[checkGlobalState()]", async () => {
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

    test("click[shiftKey&&altKey]", async () => {
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
        await page.close();
    });
    afterAll(async () => {
        driver.close();
    });
})
