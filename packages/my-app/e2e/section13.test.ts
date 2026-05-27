// e2e/section13.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import * as BH from './browser-helpers';

describe('test http://localhost:3001/section13', async () => {
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await BH.launchChromium();
        context = await BH.newContext(browser);
    });
    beforeEach(async () => {
        page = await BH.newPage(context);
        await page.goto('http://localhost:3001/section13', { timeout: 20_000 });
        await page.waitForLoadState('load', { timeout: 10_000 });
    }, 20_000);

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

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section13.zip` });
            await browser.close();
        }
    });
});
