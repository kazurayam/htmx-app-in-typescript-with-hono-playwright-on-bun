// src/index.e2e.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, chromium } from 'playwright-chromium';

describe('E2E testing using playwright-chromium', async () => {
    // Here I assume that the server at http://localhost:3000 is already up and running.
    let browser: Browser;
    beforeAll(async () => {
        // launch the browser
        browser = await chromium.launch()
    })
    it("Click the button, then a text 'こんにちは!' should appear", async () => {
        // Create a new page and navigate to a URL
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
        // Select the button
        const button = page.getByText('読み込み');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const p = page.getByText('こんにちは!');
        expect(await p.isVisible());
    });
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
