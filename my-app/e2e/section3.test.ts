// e2e/section3.test.ts
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
        await page.goto('http://localhost:3001/section3');
    })
    it("click <button hx-get=/hello>, then the button should show GETリクエスト!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-get]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const span = page.getByText('GETリクエスト!');
        expect(await span.isVisible());
    });
    it("click <button hx-post=/hello>, then the button should show POSTリクエスト!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-post]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const span = page.getByText('POSTリクエスト!');
        expect(await span.isVisible());
    });
    it("click <button hx-put=/hello>, then the button should show PUTリクエスト!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-put]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const span = page.getByText('PUTリクエスト!');
        expect(await span.isVisible());
    });
    it("click <button hx-patch=/hello>, then the button should show PATCHリクエスト!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-patch]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const span = page.getByText('PATCHリクエスト!');
        expect(await span.isVisible());
    });
    it("click <button hx-delete=/hello>, then the button should show DELETEリクエスト!", async () => {
        // Select the button
        const button = page.locator('css=button[hx-delete]');
        expect(await button.isVisible());
        // Click the button!
        await button.click();
        const span = page.getByText('DELETEリクエスト!');
        expect(await span.isVisible());
    });
    afterAll(async () => {
        // Clean up
        await browser.close()
    })
})
