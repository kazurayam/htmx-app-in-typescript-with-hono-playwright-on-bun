// e2e/section4.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section3', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        // launch the browser
        browser = await chromium.launch()
        // Create a new page and navigate to a URL
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section4');
    })
    it("click <button hx-get=/yahoo hx-target=#htmx>, then <p id=html></p> should show やっほー!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-target="#htmx"]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        // Assert expected text to appear
        const p = page.locator('css=p#htmx')
        expect((await p.innerText()).includes('やっほー!'));
    });
    it("click <button hx-get=/yahoo hx-target=this> then <button>やっほー!</button> should be rendered", async () => {
        const button = page.locator('css=button[hx-target="this"]');
        expect(await button.isVisible());
        await button.click();
        expect((await button.innerText()).includes('やっほー!'));
    })
    it("click <button hx-get=/yahoo hx-target=closest div> then B in the innerText is replaced with やっほー!", async () => {
        const button = page.locator('css=button[hx-target="closest div"]');
        expect(await button.isVisible())
        await button.click();
        const closestDiv = page.locator('xpath=//h3[text()="closest CSSセレクタ"]/following-sibling::div[1]/div[contains(.,"やっほー!")]')
        const text: string = await closestDiv.innerText()
        expect(text.includes("A"))
        expect(!text.includes("B"))
        expect(text.includes("やっほー!"))
    });
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
