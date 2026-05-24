// e2e/section3.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section3', async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        // launch the browser
            browser = await PW.chromium.launch({ headless: true });
            context = await browser.newContext();
            context.tracing.start({ screenshots:true, snapshots: true})
    }, 10_000);
    beforeEach(async () => {
        // Create a new page and navigate to a URL
        page = await context.newPage();
        // Navigate to the URL before each test
        await page.goto('http://localhost:3001/section3');
        await page.waitForLoadState('load', { timeout: 20_000 });
    }, 10_000);

    it("click <button hx-get=/hello>, then the button should show GETリクエスト!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-get]');
        // make sure the button is clickable
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await PW.expect(button).toBeEnabled();
        // Click the button!
        await button.click();
        const span: PW.Locator = page.getByText('GETリクエスト!');
        await PW.expect(span).toBeVisible();
    });

    it("click <button hx-post=/hello>, then the button should show POSTリクエスト!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-post]');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await PW.expect(button).toBeEnabled();
        // Click the button!
        await button.click();
        const span: PW.Locator = page.getByText('POSTリクエスト!');
        await PW.expect(span).toBeVisible();
    });

    it("click <button hx-put=/hello>, then the button should show PUTリクエスト!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-put]');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await PW.expect(button).toBeEnabled();
        // Click the button!
        await button.click();
        const span: PW.Locator = page.getByText('PUTリクエスト!');
        await PW.expect(span).toBeVisible();
    });

    it("click <button hx-patch=/hello>, then the button should show PATCHリクエスト!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-patch]');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await PW.expect(button).toBeEnabled();
        // Click the button!
        await button.click();
        const span: PW.Locator = page.getByText('PATCHリクエスト!');
        await PW.expect(span).toBeVisible();
    });

    it("click <button hx-delete=/hello>, then the button should show DELETEリクエスト!", async () => {
        // Select the button
        const button: PW.Locator = page.locator('css=button[hx-delete]');
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await PW.expect(button).toBeEnabled();
        // Click the button!
        await button.click();
        const span: PW.Locator = page.getByText('DELETEリクエスト!');
        await PW.expect(span).toBeVisible();
    });

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    }, 20_000);
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section3.zip` });
            await browser.close()
        }
    }, 20_000)
})
