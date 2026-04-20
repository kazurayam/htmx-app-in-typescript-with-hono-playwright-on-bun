// e2e/main.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('Test if the server is up and running', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        // launch the browser
        browser = await chromium.launch({ headless: true, timeout: 10000 })
        // Create a new page and navigate to a URL
        page = await browser.newPage();
        await page.goto('http://localhost:3001', { timeout: 10000 });
    })
    it("Navigate to the top page, click the link Section 3; then <h1>Section3</h1> should be there", async () => {
        // Select the link
        const link = page.getByText('Section 3');
        expect(await link.isVisible()).toBeTruthy();
        // Click the link!
        await link.click({ timeout: 10000 });
        const h1 = page.getByText('Section3');
        expect(await h1.isVisible()).toBeTruthy();
    });
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
