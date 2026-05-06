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
        await page.waitForLoadState('networkidle', { timeout: 10_000 });
    })
    it("click <button hx-get=/yahoo hx-target=#htmx>, then <p id=html></p> should show やっほー!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-target="#htmx"]');
        await PW.expect(button).toBeVisible();
        // Start waiting for response before clicking. Note no await.
        // See https://playwright.dev/docs/api/class-page#page-wait-for-response
        const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        // Click the button!
        await button.click();
        // await for the response
        await responsePromise;
        // assert expected text to appear
        await PW.expect(page.locator('css=p#htmx')).toContainText(/やっほー!/);
        // See https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text
    });
    it("click <button hx-get=/yahoo hx-target=this> then <button>やっほー!</button> should be rendered", async () => {
        const button = page.locator('css=button[hx-target="this"]');
        await PW.expect(button).toBeVisible()
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        await responsePromise;
        await PW.expect(button).toContainText(/やっほー!/);
    })
    it("click <button hx-get=/yahoo hx-target=closest div> then the innerText B is replaced with やっほー!", async () => {
        const button = page.locator('css=button[hx-target="closest div"]');
        await PW.expect(button).toBeVisible();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        await responsePromise;
        const closestDiv = page.locator('xpath=//h3[text()="closest CSSセレクタ"]/following-sibling::div[1]/div')
        const text: string = await closestDiv.innerText()
        expect(text).not.toMatch(/B/);      // Here I use Jest's expect, not Playwright's expect, just to show that you can use any assertion library you like!
        expect(text).toMatch(/やっほー!/);  // Here I use Jest's toMatch, not Playwright's toContainText, just to show that you can use any assertion library you like!
    });
    it("click <button hx-get=/yahoo hx-target=find p>", async () => {
        const button = page.locator('css=button[hx-target="find p"]');
        await PW.expect(button).toBeVisible()
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        await responsePromise;
        const p = page.locator('css=button[hx-target="find p"] p:first-child');
        await PW.expect(p).toContainText(/やっほー!/);
    })
    it("click <button hx-get=/yahoo hx-target=next p>", async () => {
        const button = page.locator('css=button[hx-target="next p"]');
        await PW.expect(button).toBeVisible()
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        await responsePromise;
        const p = page.locator('css=button[hx-target="next p"] + p');
        await PW.expect(p).toContainText(/やっほー!/);
    })
    it("click <button hx-get/yahoo hx-target=previous p>", async () => {
        const button = page.locator('css=button[hx-target="previous p"]');
        await PW.expect(button).toBeVisible();
        const responsePromise = page.waitForResponse(/\/yahoo/, { timeout: 10000 });
        await button.click();
        await responsePromise;
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
