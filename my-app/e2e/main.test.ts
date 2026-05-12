// e2e/main.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('Test if the server is up and running', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        // launch the browser
        browser = await PW.chromium.launch({ headless: true })
    })
    beforeEach(async () => {
        // Create a new page object and navigate to the Top page
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('http://localhost:3001');
        await page.waitForLoadState('networkidle', { timeout: 10_000 });
    })

    it("In the Top page, click the link 'Section 3'; then will navigate to another URL where <h1>Section3</h1> is visible", async () => {
        // Select the link
        const link: PW.Locator = page.getByText('Section 3');
        await link.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(link).toBeEnabled();
        // Click the link!
        await link.click();
        // Wait for another URL to load
        await page.waitForLoadState('networkidle');
        // Check if the page contains the expected text
        const h1: PW.Locator = page.locator('css=h1')
        await PW.expect(h1).toContainText(/Section3/);
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    })
    afterAll(async () => {
        await browser.close();
    })
})
