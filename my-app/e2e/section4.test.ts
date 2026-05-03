// e2e/section4.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section4', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        // launch the browser
        browser = await PW.chromium.launch({ timeout: 10000 })
    })
    beforeEach(async () => {
        // Create a new page and navigate to a URL
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section4', { timeout: 10000 });
    })
    it("click <button hx-get=/yahoo hx-target=#htmx>, then <p id=html></p> should show やっほー!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-target="#htmx"]');
        await PW.expect(button).toBeVisible();
        // Start waiting for response before clicking. Note no await.
        // See https://playwright.dev/docs/api/class-page#page-wait-for-response
        const responsePromise = page.waitForResponse(/\yahoo/, { timeout: 10000 });
        // Click the button!
        await button.click();
        // await for the response
        await responsePromise;
        // assert expected text to appear
        const p: PW.Locator = page.locator('css=p#htmx')
        await PW.expect(p).toContainText(/やっほー!/);
        // See https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text
    });
    it("click <button hx-get=/yahoo hx-target=this> then <button>やっほー!</button> should be rendered", async () => {
        const button = page.locator('css=button[hx-target="this"]');
        expect(await button.isVisible()).toBeTruthy();
        await button.click();
        await page.waitForTimeout(500)
        expect(await button.innerText()).toMatch('やっほー!');
    })
    it("click <button hx-get=/yahoo hx-target=closest div> then B in the innerText is replaced with やっほー!", async () => {
        const button = page.locator('css=button[hx-target="closest div"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(1500);
        const closestDiv = page.locator('xpath=//h3[text()="closest CSSセレクタ"]/following-sibling::div[1]/div')
        const text: string = await closestDiv.innerText()
        expect(text).not.toMatch(/B/);
        expect(text).toMatch(/やっほー!/);
    });
    it("click <button hx-get=/yahoo hx-target=find p>", async () => {
        const button = page.locator('css=button[hx-target="find p"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(1500)
        const p = page.locator('xpath=//h3[text()="find CSSセレクタ"]/following-sibling::button[1]/p[1]');
        expect(await p.innerText()).toMatch("やっほー!");
    })
    it("click <button hx-get=/yahoo hx-target=next p>", async () => {
        const button = page.locator('css=button[hx-target="next p"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(1500)
        const p = page.locator('xpath=//button[@hx-target="next p"]/following-sibling::p[1]');
        expect(await p.innerText()).toMatch("やっほー!");
    })
    it("click <button hx-get/yahoo hx-target=previous p>", async () => {
        const button = page.locator('css=button[hx-target="previous p"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click();
        await page.waitForTimeout(1500)
        const p = page.locator('xpath=//h3[text()="previous CSSセレクタ"]/following-sibling::button[1]/preceding-sibling::p[1]');
        expect(await p.innerText()).toMatch("やっほー!");
    })
    afterEach(async () => {
        await page.close();
    })
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
