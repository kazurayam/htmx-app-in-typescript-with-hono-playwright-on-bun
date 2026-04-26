// e2e/section13.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section13', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section13')
    });

    it("ダイアログ", async () => {
        page.on('dialog', async (dialog) => {
            await page.waitForTimeout(100)
            expect(dialog.message()).toMatch(/ハロー/)
            dialog.accept()
        });
        const button = page.locator('css=button[hx-confirm="ハロー"]')
        await button.click()
    })

    it("hx-boost(有効時) リンクの例", async () => {
        // I don't see what's the use
    })

    it("hx-boost(無効時) リンクの例", async () => {
        // I don't see what's the use
    })

    it("hx-boost(有効時) formの例", async () => {
        // I don't see what's the use
    })

    it("hx-push-url(true)", async () => {
        // I don't see what's the use
    })

    it("hx-push-url(false)", async () => {
        // I don't see what's the use
    })

    it("hx-push-url(カスタムURL)", async () => {
        // I don't see what's the use
    })

    it("hx-on", async () => {
        // I don't see what's the use
    })

    it("htmx:before-request", async () => {
        // I don't see what's the use
    })


    it("htmx:after-request", async () => {
        // I don't see what's the use
    })


    afterAll(async () => {
        await browser.close();
    });
});
