// e2e/main.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, chromium } from 'playwright-chromium';

describe('Test if the server is up and running', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: Browser;
    beforeAll(async () => {
        // launch the browser
        browser = await chromium.launch()
    })
    it("Navigate to the top page, click the link Section 3; then <h1>Section3</h1> should be there", async () => {
        // Create a new page and navigate to a URL
        const page = await browser.newPage();
        await page.goto('http://localhost:3001');
        // Select the link
        const link = page.getByText('Section 3');
        expect(await link.isVisible());
        // Click the link!
        await link.click();
        const h1 = page.getByText('Section3');
        expect(await h1.isVisible());
    });
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
