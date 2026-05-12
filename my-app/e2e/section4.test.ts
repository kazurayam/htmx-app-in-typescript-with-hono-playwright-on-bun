// e2e/section4.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section4', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        // launch the browser
        browser = await PW.chromium.launch()
    })
    beforeEach(async () => {
        // Create a new page and navigate to a URL
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section4');
        await page.waitForLoadState('load', { timeout: 10_000 });
    })
    it("hx-targetを指定した場合", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-target="#htmx"]');
        // make sure the button is clickable
        await button.waitFor({ state: 'visible', timeout: 10_000 });
        await PW.expect(button).toBeEnabled();
        // Start waiting for response before clicking. Note no await.
        // See https://playwright.dev/docs/api/class-page#page-wait-for-response
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/yahoo/, { timeout: 10_000 });
        // Click the button!
        await button.click();
        // await for the response
        const response: PW.Response = await responsePromise;
        expect(response.status()).toBe(200);
        // assert expected text to appear
        await PW.expect(page.locator('css=p#htmx')).toContainText(/やっほー!/);
        // See https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text
    });
    it("拡張CSSセレクタ this", async () => {
        const button = page.locator('css=button[hx-target="this"]');
        await button.waitFor({state: 'visible', timeout: 10000});
        await PW.expect(button).toBeEnabled();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(button).toContainText(/やっほー!/);
    })
    it("拡張CSSセレクタ closest", async () => {
        const button = page.locator('css=button[hx-target="closest div"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const closestDiv = page.locator('xpath=//h3[text()="closest CSSセレクタ"]/following-sibling::div[1]/div')
        const text: string = await closestDiv.innerText()
        expect(text).not.toMatch(/B/);      // Here I use Jest's expect, not Playwright's expect, just to show that you can use any assertion library you like!
        expect(text).toMatch(/やっほー!/);  // Here I use Jest's toMatch, not Playwright's toContainText, just to show that you can use any assertion library you like!
    });
    it("拡張CSSセレクタ find", async () => {
        const button = page.locator('css=button[hx-target="find p"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('css=button[hx-target="find p"] p:first-child');
        await PW.expect(p).toContainText(/やっほー!/);
    })
    it("拡張CSSセレクタ next", async () => {
        const button = page.locator('css=button[hx-target="next p"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('css=button[hx-target="next p"] + p');
        await PW.expect(p).toContainText(/やっほー!/);
    })
    it("拡張CSSセレクタ previous", async () => {
        const button = page.locator('css=button[hx-target="previous p"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('xpath=//button[@hx-target="previous p"]/preceding-sibling::p[1]');
        await PW.expect(p).toContainText(/やっほー!/);
    })
    afterEach(async () => {
        await page.close();
    })
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
